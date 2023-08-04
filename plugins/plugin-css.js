const { createFilter } = require("@rollup/pluginutils");
const path = require("path");

const plugin = (options = {}) => {
    if (!options.transform) options.transform = (code) => code;

    const styles = {};
    const alwaysOutput = options.alwaysOutput ?? false;
    const filter = createFilter(options.include ?? ["**/*.css"], options.exclude ?? []);

    /* function to sort the css imports in order - credit to rollup-plugin-postcss */
    const getRecursiveImportOrder = (id, getModuleInfo, seen = new Set()) => {
        if (seen.has(id)) return [];

        seen.add(id);

        const result = [id];

        getModuleInfo(id).importedIds.forEach((importFile) => {
            result.push(...getRecursiveImportOrder(importFile, getModuleInfo, seen));
        });

        return result;
    };

    return {
        name: "import-css",

        /* convert the css file to a module and save the code for a file output */
        transform(code, id) {
            if (!filter(id)) return;

            const transformedCode = (options.minify) ? minifyCSS(options.transform(code)) : options.transform(code);

            /* cache the result */
            if (!styles[id] || styles[id] != transformedCode) {
                styles[id] = transformedCode;
            }

            const moduleInfo = this.getModuleInfo(id);
            if (options.modules || moduleInfo.assertions?.type == "css") {
                return {
                    code: `const sheet = new CSSStyleSheet();sheet.replaceSync(${JSON.stringify(transformedCode)});export default sheet;`,
                    map: { mappings: "" }
                };
            }

            return {
                code: `export default ${JSON.stringify(transformedCode)};`,
                map: { mappings: "" }
            };
        },

        /* output a css file with all css that was imported without being assigned a variable */
        generateBundle(opts, bundle) {

            /* collect all the imported modules for each entry file */
            let modules = {};
            let entryChunk = null;
            for (let file in bundle) {
                modules = Object.assign(modules, bundle[file].modules);
                if (!entryChunk) entryChunk = bundle[file].facadeModuleId;
            }

            /* get the list of modules in order */
            const moduleIds = getRecursiveImportOrder(entryChunk, this.getModuleInfo);

            /* remove css that was imported as a string */
            const css = Object.entries(styles)
                .sort((a, b) => moduleIds.indexOf(a[0]) - moduleIds.indexOf(b[0]))
                .map(([id, code]) => {
                    if (!modules[id]) return code;
                })
                .join("\n");

            if (css.trim().length <= 0 && !alwaysOutput) return;

            /* return the asset name by going through a set of possible options */
            const getAssetName = () => {
                const fileName = options.output ?? (opts.file ?? "bundle.js");
                return `${path.basename(fileName, path.extname(fileName))}.css`;
            };

            /* return the asset fileName by going through a set of possible options */
            const getAssetFileName = () => {
                if (options.output) return options.output;
                if (opts.assetFileNames) return undefined;

                return `${getAssetName()}.css`;
            };

            this.emitFile({
                type: "asset",
                name: getAssetName(),
                fileName: getAssetFileName(),
                source: css
            });
        }
    };
};

/* minify css */
function minifyCSS(content) {
    content = content.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "");
    content = content.replace(/ {2,}/g, " ");
    content = content.replace(/ ([{:}]) /g, "$1");
    content = content.replace(/([{:}]) /g, "$1");
    content = content.replace(/([;,]) /g, "$1");
    content = content.replace(/ !/g, "!");
    return content;
}

module.exports = plugin;

import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';

console.log("[ start ] - env: ", process.env.NODE_ENV);

export default defineConfig([{
    input: "src/main.ts",
    plugins: [
        typescript(),
        commonjs({
            include: 'node_modules/**',  // Default: undefined
            extensions: ['.js', '.coffee'],  // Default: [ '.js' ]
            ignoreGlobal: false,  // Default: false
            sourceMap: false,  // Default: true
            ignore: ['conditional-runtime-dependency']
        }),
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
        }),
        (() => {
            if (process.argv.includes('--watch')) {
                return require("./plugins/plugin-electron")();
            } else {
                return undefined;
            }
        })()
    ],
    output: [{
        file: "dist/main.js",
        format: "cjs",
        sourcemap: true
    }]
}, {
    input: "ui/login.ts",
    plugins: [
        typescript(),
        commonjs({
            include: 'node_modules/**',  // Default: undefined
            extensions: ['.js', '.coffee'],  // Default: [ '.js' ]
            ignoreGlobal: false,  // Default: false
            sourceMap: false,  // Default: true
            ignore: ['conditional-runtime-dependency']
        }),
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
        }),
        html({
            title: "Login",
        })
    ],
    output: [{
        dir: "dist/ui/login",
        format: 'cjs',
    }]
}]);


const child_process = require("child_process");

function electron() {
    let electronProcess = null;

    return {
        name: "electron",
        buildStart() {
            if (electronProcess) {
                console.log("Killing electron process");
                child_process.execSync(`pkill -P ${electronProcess.pid}`);
                electronProcess = null;
            }
        },
        closeBundle() {
            if (!electronProcess) {
                console.log("Starting electron process");
                electronProcess = child_process.spawn("npm", ["run", "electron"], {
                    stdio: "inherit",
                    shell: true
                });
            }
        }
    }
}

module.exports = electron;
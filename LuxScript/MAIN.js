const fs = require("fs");
const error = require("./errors");
const run = require("./run.js");

fs.readFile("./LuxScript/Transfer/transfer.lxt", "utf8", function(err, file) {
    let file2 = file;
    if (file === "--run") code = fs.readFileSync("./LuxScript/Transfer/gui.lxt", "utf8");
    if (!file2.endsWith(".lx")) file2 += ".lx";
    error.setContext(file);
    if (file.endsWith(".lx")) file = file.slice(0, -3);
    if (!fs.existsSync(file + ".lx")) {
        error[2]();
        return false;
    }
    if (file === "--gui") return false;
    fs.readFile(file + ".lx", "utf8", function(err, data) {
        fs.readFile("./LuxScript/MAIN.lx", "utf8", function(err, dt) {
            run(dt, "MAIN", fs.readFileSync("./LuxScript/Transfer/main.lxt", "utf8"));
        });
        run(data, file);
    });
});

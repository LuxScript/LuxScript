const { app, BrowserWindow } = require('electron');
const fs = require("fs");
const path = require('path');

try {
    const data = fs.readFileSync("./LuxScript/Transfer/transferTitle.lxt", "utf8");
    
    app.on('ready', () => {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            },
            title: data,
            autoHideMenuBar: true
        });

        win.loadFile('index.html');

        // Set the app icon
        fs.readFile("./LuxScript/Transfer/transferLogo.lxt", "utf8", function(err, logo) {
            let dir = __dirname.slice(0, - 10);
            if (logo.startsWith("./")) {
                logo = logo.replace("./", "/");
            }
            const iconPath = path.join(dir + logo);
            win.setIcon(iconPath);
        });
    });
} catch (err) {
    console.error(err);
}
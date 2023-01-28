var fs = require('fs');
fs.readFile('./SmokeScript/SmokeScriptConfig.json', 'utf8', function(err, data) {
    data = JSON.parse(data);
    if (data.Msg === true) {
        let WelcomeMessage = `
        #################
        #  SmokeScript  #
        # version 0.0.2 #
        #################
        `;
        console.log(WelcomeMessage);
    }
});
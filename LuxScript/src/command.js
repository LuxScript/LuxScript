CommandName = 'Execute a command\n>';
commands = `
    - /help
    - /run
`;const fs = require('fs');const { exec } = require('child_process');const readline = require('readline');var link = 'https://discord.gg/WZuTT4erDf';const rl = readline.createInterface({input: process.stdin,output: process.stdout});console.log('**********');console.log('Run the command "/help" for help.');
rl.question(`${CommandName} `, (answer) => {
    if (answer !== '/run' && answer !== '/help' && answer !== '/downloadcreators') {
        console.log('Error: ' + 'This command doesn\'t exist.');console.log('You should try using the command "help".');
    }
    if (answer === '/run') {
        exec('.\\SmokeScript\\src\\run.bat', (err, stdout, stderr) => {
            if (err) {
                console.clear();
                console.error(err);
                return;
            }
            console.log('\n' + stdout);
        });
    }
    if (answer === '/downloadcreators') {exec('node ./SmokeScript/src/downloadCreators.js', (err, stdout, stderr) => {if (err) {console.error(err);return;}console.log('\n' + stdout);});}
    if (!answer.startsWith('/')) {
        console.log('All commands starts with a "/".');
    }
    if (answer === '/help') {
        console.log('**********');
        console.log('Commands:');
        console.log(`${commands}`);
        console.log(`If the problem keeps going. Please contact us on Discord.\n${link}\n`);
        console.log('**********');
    }
    rl.close();
});
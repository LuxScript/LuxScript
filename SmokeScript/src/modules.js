const { exec } = require('child_process');
exec('npm i python-shell', (err, stdout, stderr) => {if (err) {console.error(err);return;}console.log('\n' + stdout);});
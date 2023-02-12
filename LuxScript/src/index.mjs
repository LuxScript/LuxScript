import * as fs from "fs";
import * as url from 'url';
import * as http from 'http';
import readline from 'readline';
import moment from 'moment';
import {line, sendError} from './functions.mjs';
import {error, name2, variableValue} from './variables.mjs';
import { Console } from "console";
fs.readFile('./LuxScript/src/transfer.lxt', 'utf8', function(err, lxt) {
    if (lxt.startsWith('--')) {
        return false;
    }
    let {__dirname, varVariables, varVariablesI, insideCurlyB, fakeDataF, varVariables2, name, codeInFunc, dataF, namel, nameW, nameWE, nameWL, variablesInside, cif, varVariables5, codeSU, codeLU, HigherThan, LessThan, EqualTo, NotEqualTo, leftNum, rightNum, httpImport, dir, dirT, index, insideBigComments, insideImport} = {__dirname: url.fileURLToPath(new URL('.', import.meta.url)),varVariables: {},varVariablesI: null,insideCurlyB: null,fakeDataF: null,varVariables2: null,name: null,codeInFunc: {},dataF: null,namel: null,nameW: null,nameWE: null,nameWL: null,variablesInside: null,cif: null,varVariables5: null,codeSU: null,codeLU: null,HigherThan: null,LessThan: null,EqualTo: null,NotEqualTo: null,leftNum: null,rightNum: null,httpImport: null,dir: null,dirT: null,index: null,insideBigComments: null,insideImport: null,}
    const smse = {
        1: () => console.error(error + 'Please set the variable before trying to use it. lxE1'),
        2: () => console.error(error + 'Zero divided by something is impossible. lxE2'),
        3: () => console.error(error + 'Something devided by zero is impossible. lxE3'),
        4: () => console.error(error + 'A constant variable can\'t be redefined. lxE4'),
        5: () => console.error(error + 'String variables are only able to contain strings in it. lxE5'),
        6: () => console.error(error + 'Int variables are only able to contain numbers in it. lxE6'),
        7: () => console.error(error + 'You can\'t start a variable with a number. lxE7'),
        8: () => console.error(error + 'You can\'t remove numbers from a number. lxE8'),
        9: () => console.error(error + 'Please reinstall the programing language. The Json file in empty. lxE9')
    }
    let LuxScriptConsole = 'LuxScript:> ';
    dir = __dirname.replace(`\\${name2}\\src`, '');
    dirT = `${dir}\\LuxScript`;
    fs.readFile(`./LuxScript/LuxScriptConfig.json`, 'utf8', (err, index) => {
        if(err) {
            console.log(err);
            return;
        }
        index = index.split('\n').filter(function(line) {
            return !line.includes('#');
        }).join('\n');
        if (index.replaceAll(' ', '') === '') {
            smse[9]();
            return false;
        }
        index = JSON.parse(index);
            fs.readFile(`./${index.Folder}${lxt}`, index.ReadingWay, (err, data) => {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                insideBigComments = data.substring(data.indexOf('/*') + 2, data.indexOf('*/'));
                data = data.replace('/*' + insideBigComments + '*/', '');
                data = data.replaceAll("\\'", "\\#0");
                data = data.replaceAll("'", '"');
                data = data.replaceAll('\\#0', "'");
                data = data.replaceAll('\\;', '\\#1');
                dataF = data;
                dataF = dataF.replaceAll(/^.*\/\/.*$/mg, '');
                data.split(';').forEach((data) => {
                    if (index.Console.Console === true) {
                        data = '';
                        dataF = '';
                    }
                    if (index.Console.Console === true) {
                        if (index.Console.Message === true) {
                            console.log('Welcome to LuxScript v0.0.2.\n');
                        }
                        function consoled() {
                            rl.question(LuxScriptConsole, (command) => {
                                data = command;
                                exeCode(data);
                                consoled();
                            });
                        }
                        consoled();
                    }
                    if (index.Console.Console === false) {
                        rl.close();
                    }
                    data = data.replaceAll('\\#1', ";");
                    let lines = data.split(/\r?\n/);
                    // Classes
                    var exeClasses = function () {
                        if (data.startsWith('class ')) {
                            Cname = data.substring(data.indexOf('class ') + 6, data.indexOf('{')).replaceAll(' ', '');
                            class Classes {
                                constructor(cVariable) {
                                    this.cVariable = cVariable;
                                }
                            }
                            if (data.startsWith('new '+Cname)){
                                insideClassGet = data.substring(data.indexOf('(') + 1, data.indexOf(')'));
                                newClass = new Classes(insideClassGet);
                                console.log(newClass.cVariable);
                            }
                        }
                    }
                    exeClasses();
                    // The main code
                    function exeCode(code) {
                        code.split(/\r?\n/).forEach((code) => {
                            // Comments
                            if (code) {
                                var code = code.replaceAll(/^.*\/\/.*$/mg, '');
                            }

                            // File content
                            if (data.startsWith('%fileContent')) {
                                console.log(data);
                            }
                            // Maths
                            if (/^[0-9]/.test(code)) {
                                console.log(eval(code));
                            }
                            // Functions
                            if (code.includes('round(')) {
                                var insideRound = code.substring(code.indexOf('round(') + 6, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.round(varVariables[variableRound]);
                                code = code.replace('round(' + insideRound + ')', rounded);
                            }
                            if (code.includes('ceil(')) {
                                var insideRound = code.substring(code.indexOf('ceil(') + 5, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.ceil(varVariables[variableRound]);
                                code = code.replace('ceil(' + insideRound + ')', rounded);
                            }
                            if (code.includes('sign(')) {
                                var insideRound = code.substring(code.indexOf('sign(') + 5, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.sign(varVariables[variableRound]);
                                code = code.replace('sign(' + insideRound + ')', rounded);
                            }
                            if (code.includes('trunc(')) {
                                var insideRound = code.substring(code.indexOf('trunc(') + 6, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.trunc(varVariables[variableRound]);
                                code = code.replace('trunc(' + insideRound + ')', rounded);
                            }
                            if (code.includes('floor(')) {
                                var insideRound = code.substring(code.indexOf('floor(') + 6, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.floor(varVariables[variableRound]);
                                code = code.replace('floor(' + insideRound + ')', rounded);
                            }
                            if (code.includes('abs(')) {
                                var insideRound = code.substring(code.indexOf('abs(') + 4, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.abs(varVariables[variableRound]);
                                code = code.replace('abs(' + insideRound + ')', rounded);
                            }
                            var name = 'acos';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.acos(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'asin';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.asin(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'atan';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.atan(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'cbrt';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.cbrt(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'cos';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.cos(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'cosh';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.cosh(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'exp';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.exp(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'hypot';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.hypot(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'log';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.log(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'max';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.max(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'min';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.min(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'pow';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.pow(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'random';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.random(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'sinh';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.sinh(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'sin';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.sin(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'sqrt';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.sqrt(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'tanh';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.tanh(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            var name = 'tan';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var variableRound = insideRound.substring(insideRound.indexOf('@{') + 2, insideRound.indexOf('}'));
                                var rounded = Math.tan(varVariables[variableRound]);
                                code = code.replace(name + '(' + insideRound + ')', rounded);
                            }
                            if (code.includes('%pi')) {
                                code = code.replaceAll('%pi', Math.PI);
                            }
                            variablesUse();
                            // Var
                            function Var() {
                                var varVariables3 = varVariables[varVariablesI];
                                if (code.startsWith('var ')) {
                                    varVariablesI = code.substring(code.indexOf('var ') + 4, code.indexOf('=')).replaceAll(' ', '');
                                    if (varVariablesI.match(/^[123456789]/)) {
                                        smse[7]();
                                        return false;
                                    }
                                    if (!code.includes('=')) {
                                        varVariables[varVariablesI] = 'undefined';
                                    } else {
                                        varVariables[varVariablesI] = code.split('=')[1].replace(' ', '');
                                    }
                                    if (/^[0-9]/.test(varVariables[varVariablesI])) {
                                        var evaled = eval(varVariables[varVariablesI]);
                                        varVariables[varVariablesI] = varVariables[varVariablesI].replace(varVariables[varVariablesI], evaled);
                                    }
                                    if (varVariables[varVariablesI].startsWith('(')) {
                                        if (varVariables[varVariablesI].endsWith(')')) {
                                            varVariables[varVariablesI] = varVariables[varVariablesI].substring(1).slice(0, - 1);
                                        }
                                    }
                                    if (varVariables[varVariablesI].startsWith(' ')) {
                                        var skipper = varVariables[varVariablesI];
                                        varVariables[varVariablesI] = varVariables[varVariablesI].replaceAll(' ', '');
                                        var skipper2 = varVariables[varVariablesI];
                                        varVariables[varVariablesI] = varVariables[varVariablesI].replace('"' + skipper2 + '"', '"' + skipper + '"');
                                    }
                                    // Removing the "" from the variable
                                    if (varVariables[varVariablesI].startsWith('"')) {
                                        if (varVariables[varVariablesI].endsWith('"')) {
                                            varVariables[varVariablesI] = varVariables[varVariablesI].substring(1).slice(0, - 1);
                                        }
                                    }
                                    if (varVariablesI.startsWith('{')) {
                                        varVariablesI = varVariablesI.substring(1).slice(0, - 1);
                                    }
                                } else {
                                }
                            }
                            Var();
                            // Const
                            function Const() {
                                if (code.startsWith('const ')) {
                                    varVariablesI = code.substring(code.indexOf('const ') + 6, code.indexOf('=')).replaceAll(' ', '');
                                    if (!code.includes('=')) {
                                        varVariables[varVariablesI] = 'undefined';
                                    } else {
                                        varVariables[varVariablesI] = code.split('=')[1].replace(' ', '');
                                        codeLU = true;
                                    }
                                    if (/^[0-9]/.test(varVariables[varVariablesI])) {
                                        var evaled = eval(varVariables[varVariablesI]);
                                        varVariables[varVariablesI] = varVariables[varVariablesI].replace(varVariables[varVariablesI], evaled);
                                    }
                                    // Removing the "" from the variable
                                    if (varVariables[varVariablesI].startsWith('"')) {
                                        if (varVariables[varVariablesI].endsWith('"')) {
                                            varVariables[varVariablesI] = varVariables[varVariablesI].substring(1).slice(0, - 1);
                                        }
                                    }
                                    fakeDataF = dataF
                                    var varVariables3;
                                    if (varVariables[varVariablesI] !== varVariables3) {
                                        if (codeLU !== true) {
                                            smse[4]();
                                            process.exit(0);
                                        }
                                    } else {

                                    }
                                    if (varVariablesI.startsWith('{')) {
                                        varVariablesI = varVariablesI.substring(1).slice(0, - 1);
                                    }
                                } else {
                                }
                            }
                            Const();
                            // String
                            function String() {
                                if (code.startsWith('string ')) {
                                    varVariablesI = code.substring(code.indexOf('string ') + 7, code.indexOf('=')).replaceAll(' ', '');
                                    if (!code.includes('=')) {
                                        varVariables[varVariablesI] = 'undefined';
                                        codeSU = true;
                                    } else {
                                        varVariables[varVariablesI] = code.split('=')[1].replace(' ', '');
                                    }
                                    if (varVariables[varVariablesI].startsWith('"')) {
                                        // Removing the "" from the variable
                                        if (varVariables[varVariablesI].startsWith('"')) {
                                            if (varVariables[varVariablesI].endsWith('"')) {
                                                varVariables[varVariablesI] = varVariables[varVariablesI].substring(1).slice(0, - 1);
                                            }
                                        }
                                        if (varVariablesI.startsWith('{')) {
                                            varVariablesI = varVariablesI.substring(1).slice(0, - 1);
                                        }
                                    } else {
                                        if (codeSU !== true) {
                                            smse[5]();
                                            process.exit(0);
                                        }
                                    }
                                } else {
                                }
                            }
                            String();
                            // Int
                            function Int() {
                                if (code.startsWith('int ')) {
                                    varVariablesI = code.substring(code.indexOf('int ') + 4, code.indexOf('=')).replaceAll(' ', '');
                                    if (!code.includes('=')) {
                                        varVariables[varVariablesI] = 'undefined';
                                    } else {
                                        varVariables[varVariablesI] = code.split('=')[1].replace(' ', '');
                                    }
                                    if (/^[0-9]/.test(varVariables[varVariablesI])) {
                                        var evaled = eval(varVariables[varVariablesI]);
                                        varVariables[varVariablesI] = varVariables[varVariablesI].replace(varVariables[varVariablesI], evaled);
                                    }
                                    if (!varVariables[varVariablesI].startsWith('"')) {
                                        // Removing the "" from the variable
                                        if (varVariables[varVariablesI].startsWith('"')) {
                                            if (varVariables[varVariablesI].endsWith('"')) {
                                                varVariables[varVariablesI] = varVariables[varVariablesI].substring(1).slice(0, - 1);
                                            }
                                        }
                                        if (varVariablesI.startsWith('{')) {
                                            varVariablesI = varVariablesI.substring(1).slice(0, - 1);
                                        }
                                    } else {
                                        smse[6]();
                                        process.exit(0);
                                    }
                                } else {
                                }
                            }
                            Int();
                            /*
                            // No prefix variables
                            if (data.startsWith(varVariablesI)) {
                                var vVIL = varVariablesI.length;
                                var variablesName = data.substring(data.indexOf(varVariablesI) + vVIL, data.indexOf('\n'));
                                console.log(variablesName);
                                var variablesValue = data.substring(data.indexOf('=') + 1, data.indexOf('\n'));
                                varVariables[varVariablesI] = variablesValue;
                            }
                            */

                            function variablesUse() {
                                if (code.includes('@{')) {
                                    let pattern = /@{[a-zA-Z0-9]+}/g;
                                    code = code.replace(pattern, function(match) {
                                        let varName = match.substring(2, match.length - 1);
                                        return varVariables[varName];
                                    });
                                }
                            }
                            variablesUse();
                            // Imports
                            var betImport = data.substring(data.indexOf('import') + 6, data.indexOf('('));
                            if (data.startsWith('import' + betImport + '(')) {
                                insideImport = data.substring(data.indexOf('(') + 1, data.indexOf(')')).replaceAll(' ', '');
                                if (insideImport.startsWith('"')) {
                                    if (insideImport.endsWith('"')) {
                                        insideImport = insideImport.substring(1).slice(0, - 1);
                                        // Javascript import
                                        if (code.includes("import('javascript')")) {
                                            code = code.replace("import('javascript')", "");
                                            if (code.startsWith('$javascript$')) {
                                                console.log(code.replace('$javascript$', ''));
                                                eval(code.replace('$javascript$', ''));
                                            }
                                        }
                                    }
                                }
                            }
                            /*
                            
                            DOCUMENTS

                            */
                            /*
                            fs.readFile('./Scripts/index.html', 'utf8', function(err, html) {
                                console.log(html);
                                const dom = new JSDOM(`${html}`);
                                const document = dom.window.document;
                                if (code.startsWith('document.innerhtml(')) {
                                    var insideDocument = code.substring(code.indexOf('document.innerhtml(') + 19, code.lastIndexOf(')'));
                                    if (insideDocument.startsWith('"')) {
                                        if (insideDocument.endsWith('"')) {
                                            insideDocument = insideDocument.substring(1).slice(0, - 1);
                                        }
                                    }
                                    document.innerHTML = insideDocument;
                                }
                            });
                            */
                            if (code.startsWith('prompt(')) {
                                var insidePrompt = code.substring(code.indexOf('prompt(') + 7, code.indexOf(')'));
                                const rl = readline.createInterface({
                                    input: process.stdin,
                                    output: process.stdout
                                });
                                rl.question(insidePrompt, (userInput) => {
                                    varVariables['userInput'] = userInput;
                                    rl.close();
                                });
                            }
                            var name = 'circle.findr';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var c = 2*Math.PI*insideRound;
                                var a = Math.PI*insideRound*insideRound;
                                var d = 2*insideRound;
                                console.log('Diameter: ' + d);
                                console.log('Circumferance: ' + c);
                                console.log('Air: ' + a);
                            }
                            var name = 'circle.finda';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var r = insideRound/Math.PI;
                                var r = Math.sqrt(r);
                                var c = 2*Math.PI*r;
                                var d = 2*r;
                                console.log('Air: ' + insideRound);
                                console.log('Rayon: ' + r);
                                console.log('Diameter: ' + d);
                                console.log('Circumferance: ' + c);
                            }
                            var name = 'circle.findc';
                            if (code.includes(name + '(')) {
                                var insideRound = code.substring(code.indexOf(name + '(') + name.length + 1, code.indexOf(')'));
                                var r = insideRound/Math.PI;
                                var r = r/2
                                var c = 2*Math.PI*r;
                                var d = 2*r;
                                console.log('Air: ' + Math.PI*r*r);
                                console.log('Rayon: ' + r);
                                console.log('Diameter: ' + d);
                                console.log('Circumferance: ' + c);
                            }
                            /*

                            PRINTS

                            */
                            // Print.clean
                            var betPrint = data.substring(data.indexOf('print.clean') + 11, data.indexOf('('));
                            if (code.startsWith('print.clean' + betPrint + '(')) {    
                                var insidePrint = code.substring(code.indexOf('print.clean' + betPrint + '(') + 12 + betPrint.length, code.lastIndexOf(')'));
                                eval(`console.clear(${insidePrint});`);
                            }
                            // Print.warn
                            var betPrint = data.substring(data.indexOf('print.warn') + 10, data.indexOf('('));
                            if (code.startsWith('print.warn' + betPrint + '(')) {    
                                var insidePrint = code.substring(code.indexOf('print.warn' + betPrint + '(') + 11 + betPrint.length, code.lastIndexOf(')'));
                                eval(`console.warn(${insidePrint});`);
                            }
                            // Print.error
                            var betPrint = data.substring(data.indexOf('print.error') + 11, data.indexOf('('));
                            if (code.startsWith('print.error' + betPrint + '(')) {    
                                var insidePrint = code.substring(code.indexOf('print.error' + betPrint + '(') + 12 + betPrint.length, code.lastIndexOf(')'));
                                eval(`console.error(${insidePrint});`);
                            }
                            // Print
                            var betPrint = data.substring(data.indexOf('print') + 5, data.indexOf('('));
                            var checker = data.substring(data.indexOf(/\n/) + 1, data.indexOf('('));
                            if (checker.includes('print.error') || checker.includes('print.warn') || checker.includes('print.clean')) return false;
                            if (code.startsWith('print' + betPrint + '(')) { 
                                var insidePrint = code.substring(code.indexOf('print' + betPrint + '(') + 6 + betPrint.length, code.lastIndexOf(')'));
                                eval(`console.log(${insidePrint});`);
                            }
                            /*
                            
                            JSON
                            
                            */
                            /*
                            var betJson = data.substring(data.indexOf('json.parse') + 10, data.indexOf('('));
                            if (code.startsWith('json.parse' + betJson + '(')) {
                                var insideJson = code.substring(code.indexOf('json.parse' + betJson + '(' + 11 + betJson.length, code.indexOf(')')));
                                console.log(insideJson);
                                var parsedJson = JSON.parse(insideJson);
                                console.log(parsedJson);
                            }
                            */
                            // Loops
                            if (code.startsWith('loop(')) {
                                var numLoops = code.substring(code.indexOf('loop(') + 5, code.indexOf(')'));
                                var codeInLoops = code.substring(code.indexOf('){') + 2, code.indexOf('}'));
                                for (var i = 0; i < numLoops; i++) {
                                    varVariables['i'] = i;
                                    exeCode(codeInLoops);
                                }
                            }
                            // FUNCY'S
                            // Replaceall
                            if (code.includes('.replaceall(')) {
                                var insideFuncy2 = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                var leftString2 = insideFuncy2.substring(insideFuncy2.indexOf('(') + 1, insideFuncy2.indexOf(',')).replaceAll(' ', '').substring(1).slice(0, - 1);
                                var rightString2 = insideFuncy2.substring(insideFuncy2.indexOf(',') + 1, insideFuncy2.indexOf(')')).replaceAll(' ', '').substring(1).slice(0, - 1);
                                var variableReplace2 = code.substring(code.indexOf('\n') + 1, code.indexOf('.replaceall(')).replaceAll(' ', '');
                                varVariables[variableReplace2] = varVariables[variableReplace2].replaceAll(leftString2, rightString2);
                                console.log(varVariables[variableReplace2]);
                            }
                            // Replace
                            var leftString;
                            var rightString;
                            if (code.includes('.replace(')) {
                                var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                leftString = insideFuncy.substring(insideFuncy.indexOf('(') + 1, insideFuncy.indexOf(',')).replaceAll(' ', '').substring(1).slice(0, - 1);
                                rightString = insideFuncy.substring(insideFuncy.indexOf(',') + 1, insideFuncy.indexOf(')')).replaceAll(' ', '').substring(1).slice(0, - 1);
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.replace(')).replaceAll(' ', '');
                                varVariables[variableReplace] = varVariables[variableReplace].replace(leftString, rightString);
                                console.log(varVariables[variableReplace]);
                            }
                            // Remove
                            var leftString;
                            var rightString;
                            if (code.includes('.remove(')) {
                                var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                if (insideFuncy.includes('"')) {
                                    leftString = insideFuncy.substring(1).slice(0, - 1);
                                    rightString = '';
                                } else {
                                    smse[8]();
                                    return false;
                                }
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.remove(')).replaceAll(' ', '');
                                varVariables[variableReplace] = varVariables[variableReplace].replace(leftString, rightString);
                                console.log(varVariables[variableReplace]);
                            }
                            // Removeall
                            var leftString;
                            var rightString;
                            if (code.includes('.removeall(')) {
                                var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                if (insideFuncy.includes('"')) {
                                    leftString = insideFuncy.substring(2).slice(0, - 2);
                                    rightString = '';
                                } else {
                                    smse[8]();
                                    return false;
                                }
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.removeall(')).replaceAll(' ', '');
                                code = code.replace(variableReplace + '.removeall(' + insideFuncy + ')', variableReplace + '.replaceAll(' + insideFuncy + ')', '');
                            }
                            // Slice
                            var leftString;
                            var rightString;
                            if (code.includes('.slice(')) {
                                var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                if (insideFuncy.includes('0' || '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9')) {
                                    leftString = parseInt(insideFuncy.substring(insideFuncy.indexOf('(') + 1, insideFuncy.indexOf(',')).replaceAll(' ', ''));
                                    rightString = parseInt(insideFuncy.substring(insideFuncy.indexOf(',') + 1, insideFuncy.indexOf(')')).replaceAll(' ', ''));
                                }
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.slice(')).replaceAll(' ', '');
                                code = code.replace(variableReplace + '.slice(' + insideFuncy + ')', varVariables[varVariablesI].slice(leftString, rightString));
                            }
                            // Split
                            var leftString;
                            var rightString;
                            if (code.includes('.split(')) {
                                var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                leftString = insideFuncy;
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.split(')).replaceAll(' ', '');
                                code = code.replace(variableReplace + '.split(' + insideFuncy + ')', varVariables[varVariablesI].split(leftString));
                            }
                            // Length
                            var leftString;
                            var rightString;
                            if (code.includes('.length')) {
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.length')).replaceAll(' ', '');
                                var lengthVar = varVariables[varVariablesI].length;
                                code = code.replace(variableReplace + '.length', lengthVar);
                            }
                            var leftString;
                            if (code.includes('.substring(')) {
                                var insideFuncy = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                leftString = parseInt(insideFuncy);
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.substring(')).replaceAll(' ', '');
                                code = code.replace(variableReplace + '.substring(' + insideFuncy + ')', varVariables[varVariablesI].substring(leftString));
                            }
                            // Eval
                            if (code.startsWith('eval(')) {
                                var insideEval = code.substring(code.indexOf('eval(') + 5, code.lastIndexOf(')'));
                                if (insideEval.startsWith('"')) {
                                    if (insideEval.includes('&&')) {
                                        insideEval.replaceAll('&&', '\n');
                                        console.log(insideEval);
                                        exeCode(insideEval);
                                    } else {
                                        exeCode(insideEval);
                                    }
                                }
                            }
                            // Webservers
                            if (data.startsWith('$http(')) {
                                var insideHttp = data.substring(data.indexOf('$http(') + 6, data.lastIndexOf(')'));
                                insideHttp = insideHttp.split(',');
                                http.createServer(function (req, res) {
                                    res.write(insideHttp[0].substring(1).slice(0, - 1)); //write a response to the client
                                    res.end(); //end the response
                                }).listen(parseInt(insideHttp[1].replaceAll(' ', ''))); //the server object listens on port 8080
                            }
                            if (code.startsWith('if')) {
                                var ifValue = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                var ifExe = code.substring(code.indexOf('{') + 1, code.indexOf('}'));
                                console.log(ifExe);
                                if (eval(ifValue)) {
                                    exeCode('print("Hello World!")');
                                }
                            }
                        });
                    }
                // Executing the code
                exeCode(data);
            });
        });
    });
});
import * as fs from "fs";
import * as url from 'url';
import * as http from 'http';
import * as jsdom from 'jsdom';
import * as playSound from 'play-sound';
const { JSDOM } = jsdom;
import {line, sendError} from './functions.mjs';
import {error, name2, variableValue} from './variables.mjs';
import { replace } from "ejs-template/ejs/filters.js";
let {__dirname, varVariables, varVariablesI, insideCurlyB, fakeDataF, varVariables2, name, codeInFunc, dataF, namel, nameW, nameWE, nameWL, variablesInside, cif, varVariables5, codeSU, codeLU, HigherThan, LessThan, EqualTo, NotEqualTo, leftNum, rightNum, httpImport, dir, dirT, index, insideBigComments, insideImport} = {__dirname: url.fileURLToPath(new URL('.', import.meta.url)),varVariables: {},varVariablesI: null,insideCurlyB: null,fakeDataF: null,varVariables2: null,name: null,codeInFunc: {},dataF: null,namel: null,nameW: null,nameWE: null,nameWL: null,variablesInside: null,cif: null,varVariables5: null,codeSU: null,codeLU: null,HigherThan: null,LessThan: null,EqualTo: null,NotEqualTo: null,leftNum: null,rightNum: null,httpImport: null,dir: null,dirT: null,index: null,insideBigComments: null,insideImport: null,}
const smse = {
    1: () => console.error(error + 'Please set the variable before trying to use it. SmSE1'),
    2: () => console.error(error + 'Zero divided by something is impossible. SmSE2'),
    3: () => console.error(error + 'Something devided by zero is impossible. SmSE3'),
    4: () => console.error(error + 'A constant variable can\'t be redefined. SmSE4'),
    5: () => console.error(error + 'String variables are only able to contain strings in it. SmSE5'),
    6: () => console.error(error + 'Int variables are only able to contain numbers in it. SmSE6'),
    7: () => console.error(error + 'You can\'t start a variable with a number. SmSE7'),
    8: () => console.error(error + 'you can\'t remove numbers from a number. SmSE8')
}
dir = __dirname.replace(`\\${name2}\\src`, '');
dirT = `${dir}\\SmokeScript`;
fs.readFile(`${dirT}\\SmokeScriptConfig.json`, 'utf8', (err, index) => {
    index = index.split('\n').filter(function(line) {
        return !line.includes('#');
    }).join('\n');
    index = JSON.parse(index);
    fs.readdir(`${dir}${index.Folder.slice(0, -1)}`, index.ReadingWay, (err, files) => {
        if (index.ShowFilesOnStart === true) {
            console.log(``);
            console.log(`The files running are:`);
        }
        files.forEach(file => {
            if (index.ShowFilesOnStart === true) {
                console.log(`   ${'- ' + file}`);
            }
            fs.readFile(`${dir}${index.Folder}${file}`, index.ReadingWay, (err, data) => {
                insideBigComments = data.substring(data.indexOf('/*') + 2, data.indexOf('*/'));
                data = data.replace('/*' + insideBigComments + '*/', '');
                data = data.replaceAll("\\'", "\\#0");
                data = data.replaceAll("'", '"');
                data = data.replaceAll('\\#0', "'");
                data = data.replaceAll('\\;', '\\#1');
                dataF = data;
                dataF = dataF.replaceAll(/^.*\/\/.*$/mg, '');
                data.split(';').forEach((data) => {
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
                    // Functions
                    var exeFunctions = function () {
                        let functionss;
                        if (data.startsWith('void ')) {
                            name = data.substring(data.indexOf('void ') + 5, data.indexOf('{')).replaceAll(' ', '');
                            codeInFunc = dataF.substring(dataF.indexOf('{') + 1, dataF.indexOf('}'));
                            if (!codeInFunc.startsWith('$')) {
                                functionss = function (variables) {
                                    cif = codeInFunc.substring(codeInFunc.indexOf("\n") + 1);
                                    if (cif.startsWith('    ')) {
                                        codeInFunc = codeInFunc.replace(cif, cif.substring(4));
                                    }
                                    if (cif.startsWith('   ')) {
                                        codeInFunc = codeInFunc.replace(cif, cif.substring(3));
                                    }
                                    if (cif.startsWith('  ')) {
                                        codeInFunc = codeInFunc.replace(cif, cif.substring(2));
                                    }
                                    if (cif.startsWith(' ')) {
                                        codeInFunc = codeInFunc.replace(cif, cif.substring(1));
                                    }
                                    varVariables[varVariablesI] = variables;
                                    exeCode(codeInFunc);
                                }
                                var betFunc = data.substring(data.indexOf('func') + 4, data.indexOf('('));
                                if (data.includes(name.replaceAll(' ', ''))) {
                                    namel = name.length
                                    nameW = data.substring(data.indexOf('void ') + 5, data.indexOf('('));
                                    nameWE = data.substring(data.indexOf('(') + 1, data.indexOf(')'));
                                    nameWL = nameW.length;
                                    variablesInside = dataF.substring(dataF.indexOf('func' + betFunc + '(' + nameW + '(') + nameWL + 6 + betFunc.length, dataF.indexOf('))'));
                                    //if (nameW.substring().includes('a' || 'b' || 'c' || 'd' || 'e' || 'f' || 'g' || 'h' || 'i' || 'j' || 'k' || 'l' || 'm' || 'n' || 'o' || 'p' || 'q' || 'r' || 's' || 't' || 'u' || 'v' || 'w' || 'x' || 'y' || 'z' || 'A' || 'B' || 'C' || 'D' || 'E' || 'F' || 'G' || 'H' || 'I' || 'J' || 'K' || 'L' || 'M' || 'N' || 'O' || 'P' || 'Q' || 'R' || 'S' || 'T' || 'U' || 'V' || 'W' || 'X' || 'Y' || 'Z' || '$')) {
                                        if (!dataF.includes('func' + betFunc + '(' + nameW + '(' + variablesInside + ')' + ')')) {
                                            return false;
                                        }
                                        if (nameWE === '') {
                                            if (variablesInside !== '') {
                                                if (dataF.includes('func' + betFunc + '(' + nameW + '(' + variablesInside + ')' + ')')) {
                                                    smse[1]();
                                                    return false;
                                                }
                                            }
                                        }
                                        if (variablesInside.includes('"')) {
                                            variablesInside = variablesInside.replace("\"", '').replace("\"", '');
                                        }
                                        functionss(variablesInside);
                                    //}
                                }
                            }
                        }
                    }
                    exeFunctions();
                    // If statement
                    if (data.startsWith("if(")) {
                        var insideIfS = data.substring(data.indexOf('if(') + 3, data.indexOf(')'));
                        var insideIfC = data.substring(data.indexOf('){') + 2, data.indexOf('}'));
                        if (eval(insideIfS)) {

                            console.log(insideIfC);

                            // Trouble executing the code here
                            exeCode(insideIfC);
                        }
                    }
                    // The main code
                    function exeCode(code) {
                        code.split(/\r?\n/).forEach((code) => {
                            // Comments
                            if (code.substring()) {
                                var code = code.replaceAll(/^.*\/\/.*$/mg, '');
                            }
                            // File content
                            if (data.startsWith('%fileContent')) {
                                console.log(data);
                            }
                            // Maths
                            var xi;
                            var betMath = data.substring(data.indexOf('math') + 4, data.indexOf('('));
                            if (code.includes('math' + betMath + '(')) {
                                var mathInside = code.substring(code.indexOf('math' + betMath + '(') + 5 + betMath.length, code.indexOf(')'));
                                mathInside = mathInside.replace(varVariablesI, varVariables[varVariablesI]);
                                eval("xi = " + mathInside);
                                code = code.replace('math' + betMath + '(' + mathInside + ')', xi);
                            }
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
                                    if (varVariables[varVariablesI].includes('math(')) {
                                        var mathInside = varVariables[varVariablesI].substring(varVariables[varVariablesI].indexOf('math(') + 5, varVariables[varVariablesI].indexOf(')'));
                                        mathInside = mathInside.replace(varVariablesI, varVariables[varVariablesI]);
                                        if (mathInside.includes('+')) {
                                            var leftNumM = parseInt(mathInside.slice('+')[0]);
                                            var rightNumM = parseInt(mathInside.split('+')[1].replaceAll(' ', ''));
                                            eval(leftNumM + rightNumM);
                                        }
                                        if (mathInside.includes('-')) {
                                            var leftNumM = parseInt(mathInside.slice('-')[0]);
                                            var rightNumM = parseInt(mathInside.split('-')[1].replaceAll(' ', ''));
                                            eval(leftNumM - rightNumM);
                                        }
                                        if (mathInside.includes('*')) {
                                            var leftNumM = parseInt(mathInside.slice('*')[0]);
                                            var rightNumM = parseInt(mathInside.split('*')[1].replaceAll(' ', ''));
                                            eval(leftNumM * rightNumM);
                                        }
                                        if (mathInside.includes('/')) {
                                            var leftNumM = parseInt(mathInside.slice('/')[0]);
                                            if (leftNumM === 0) {
                                                smse[2]();
                                                return false;
                                            }
                                            var rightNumM = parseInt(mathInside.split('/')[1].replaceAll(' ', ''));
                                            if (rightNumM === 0) {
                                                smse[3]();
                                                return false;
                                            }
                                            eval(leftNumM / rightNumM);
                                        }
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
                                    if (varVariables[varVariablesI].startsWith('{')) {
                                        if (varVariablesI.startsWith('@')) {
                                            varVariables[varVariablesI].replace('@', '');
                                            insideCurlyB = data.substring(data.indexOf('{') + 1, data.indexOf('}'));
                                            exeCode(insideCurlyB);
                                        }
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
                                    // Removing the "" from the variable
                                    if (varVariables[varVariablesI].startsWith('"')) {
                                        if (varVariables[varVariablesI].endsWith('"')) {
                                            varVariables[varVariablesI] = varVariables[varVariablesI].substring(1).slice(0, - 1);
                                        }
                                    }
                                    fakeDataF = dataF
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
                                    if (varVariables[varVariablesI].startsWith('{')) {
                                        if (varVariablesI.startsWith('@')) {
                                            varVariables[varVariablesI].replace('@', '');
                                            insideCurlyB = data.substring(data.indexOf('{') + 1, data.indexOf('}'));
                                            exeCode(insideCurlyB);
                                        }
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
                                        if (varVariables[varVariablesI].startsWith('{')) {
                                            if (varVariablesI.startsWith('@')) {
                                                varVariables[varVariablesI].replace('@', '');
                                                insideCurlyB = data.substring(data.indexOf('{') + 1, data.indexOf('}'));
                                                exeCode(insideCurlyB);
                                            }
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
                                        if (varVariables[varVariablesI].startsWith('{')) {
                                            if (varVariablesI.startsWith('@')) {
                                                varVariables[varVariablesI].replace('@', '');
                                                insideCurlyB = data.substring(data.indexOf('{') + 1, data.indexOf('}'));
                                                exeCode(insideCurlyB);
                                            }
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

                            if (code.includes('@{')) {
                                let pattern = /@{[a-zA-Z0-9]+}/g;
                                code = code.replace(pattern, function(match) {
                                    let varName = match.substring(2, match.length - 1);
                                    return varVariables[varName];
                                });
                            }
                            
                            // Disable / Enable message viewing in the console
                            if (code.startsWith('%file')) {
                                console.log('Current file: ' + files);
                            }
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
                            /*

                            PRINTS

                            */
                            // Print.error
                            var betPrint = data.substring(data.indexOf('print.clean') + 11, data.indexOf('('));
                            if (code.startsWith('print.clean' + betPrint + '(')) {    
                                // Print String
                                if (code.replace('print.clean' + betPrint + '(', '').includes("\"")) {
                                    var idkAnymore = code.substring(13 + betPrint.length).replace('print.clean' + betPrint + '(', '').slice(0,-1).slice(0,-1);
                                    if (eval('typeof varVariablesI !== "undefined"')) {
                                        console.clear(idkAnymore.replaceAll('{$' + varVariablesI + '}', varVariables[varVariablesI]));
                                    } else {
                                        console.clear(code.substring(7 + betPrint.length).replace('print.clean' + betPrint + '(', '').slice(0,-1).slice(0,-1));
                                    }
                                // Print Number
                                } else if (code.replace('print.clean' + betPrint + '(', '')) {
                                    if (code.match(/[0-9]/)) {
                                        var insidePrintN = code.substring(code.indexOf('print.clean' + betPrint + '(') + 12 + betPrint.length, code.indexOf(')'));
                                        console.clear(insidePrintN);
                                    // Print Variable
                                    } else {
                                        if (eval('typeof varVariables[varVariablesI] !== "undefined"')) {
                                            if (varVariables[varVariablesI].includes('"')) {
                                                console.clear(varVariable[varVariablesI].substring(1).slice(0, - 1))
                                            } else {
                                                var insideVariableName = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                                if (varVariables[varVariablesI].includes('.replace(')) {
                                                    var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                                    var insideVariableName = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                                    var leftString = insideFuncy.substring(insideFuncy.indexOf('(') + 1, insideFuncy.indexOf(',')).replaceAll(' ', '');
                                                    var rightString = insideFuncy.substring(insideFuncy.indexOf(',') + 1, insideFuncy.indexOf(')')).replaceAll(' ', '');
                                                    console.clear(varVariables[insideVariableName].replace(leftString, rightString));
                                                }
                                                console.clear(varVariables[insideVariableName]);
                                            }
                                        }
                                    }
                                }
                            }
                            // Print.warn
                            var betPrint = data.substring(data.indexOf('print.warn') + 10, data.indexOf('('));
                            if (code.startsWith('print.warn' + betPrint + '(')) {    
                                // Print String
                                if (code.replace('print.warn' + betPrint + '(', '').includes("\"")) {
                                    var idkAnymore = code.substring(12 + betPrint.length).replace('print.warn' + betPrint + '(', '').slice(0,-1).slice(0,-1);
                                    if (eval('typeof varVariablesI !== "undefined"')) {
                                        console.error(idkAnymore.replaceAll('{$' + varVariablesI + '}', varVariables[varVariablesI]));
                                    } else {
                                        console.error(code.substring(7 + betPrint.length).replace('print.warn' + betPrint + '(', '').slice(0,-1).slice(0,-1));
                                    }
                                // Print Number
                                } else if (code.replace('print.warn' + betPrint + '(', '')) {
                                    if (code.match(/[0-9]/)) {
                                        var insidePrintN = code.substring(code.indexOf('print.warn' + betPrint + '(') + 12 + betPrint.length, code.indexOf(')'));
                                        console.error(insidePrintN);
                                    // Print Variable
                                    } else {
                                        if (eval('typeof varVariables[varVariablesI] !== "undefined"')) {
                                            if (varVariables[varVariablesI].includes('"')) {
                                                console.error(varVariable[varVariablesI].substring(1).slice(0, - 1))
                                            } else {
                                                var insideVariableName = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                                if (varVariables[varVariablesI].includes('.replace(')) {
                                                    var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                                    var insideVariableName = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                                    var leftString = insideFuncy.substring(insideFuncy.indexOf('(') + 1, insideFuncy.indexOf(',')).replaceAll(' ', '');
                                                    var rightString = insideFuncy.substring(insideFuncy.indexOf(',') + 1, insideFuncy.indexOf(')')).replaceAll(' ', '');
                                                    console.log(varVariables[insideVariableName].replace(leftString, rightString));
                                                }
                                                console.error(varVariables[insideVariableName]);
                                            }
                                        }
                                    }
                                }
                            }
                            // Print.error
                            var betPrint = data.substring(data.indexOf('print.error') + 11, data.indexOf('('));
                            if (code.startsWith('print.error' + betPrint + '(')) {    
                                // Print String
                                if (code.replace('print.error' + betPrint + '(', '').includes("\"")) {
                                    var idkAnymore = code.substring(13 + betPrint.length).replace('print.error' + betPrint + '(', '').slice(0,-1).slice(0,-1);
                                    if (eval('typeof varVariablesI !== "undefined"')) {
                                        console.error(idkAnymore.replaceAll('{$' + varVariablesI + '}', varVariables[varVariablesI]));
                                    } else {
                                        console.error(code.substring(7 + betPrint.length).replace('print.error' + betPrint + '(', '').slice(0,-1).slice(0,-1));
                                    }
                                // Print Number
                                } else if (code.replace('print.error' + betPrint + '(', '')) {
                                    if (code.match(/[0-9]/)) {
                                        var insidePrintN = code.substring(code.indexOf('print.error' + betPrint + '(') + 12 + betPrint.length, code.indexOf(')'));
                                        console.error(insidePrintN);
                                    // Print Variable
                                    } else {
                                        if (eval('typeof varVariables[varVariablesI] !== "undefined"')) {
                                            if (varVariables[varVariablesI].includes('"')) {
                                                console.error(varVariable[varVariablesI].substring(1).slice(0, - 1))
                                            } else {
                                                var insideVariableName = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                                if (varVariables[varVariablesI].includes('.replace(')) {
                                                    var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                                    var insideVariableName = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                                    var leftString = insideFuncy.substring(insideFuncy.indexOf('(') + 1, insideFuncy.indexOf(',')).replaceAll(' ', '');
                                                    var rightString = insideFuncy.substring(insideFuncy.indexOf(',') + 1, insideFuncy.indexOf(')')).replaceAll(' ', '');
                                                    console.log(varVariables[insideVariableName].replace(leftString, rightString));
                                                }
                                                console.error(varVariables[insideVariableName]);
                                            }
                                        }
                                    }
                                }
                            }
                            // Print
                            var betPrint = data.substring(data.indexOf('print') + 5, data.indexOf('('));
                            var checker = data.substring(data.indexOf(/\n/) + 1, data.indexOf('('));
                            if (checker.includes('print.error') || checker.includes('print.warn') || checker.includes('print.clean')) return false;
                            if (code.startsWith('print' + betPrint + '(')) { 
                                // Print String
                                if (code.replace('print' + betPrint + '(', '').includes("\"")) {
                                    var idkAnymore = code.substring(7 + betPrint.length).replace('print' + betPrint + '(', '').slice(0,-1).slice(0,-1);
                                    if (eval('typeof varVariablesI !== "undefined"')) {
                                        console.log(idkAnymore.replaceAll('{$' + varVariablesI + '}', varVariables[varVariablesI]));
                                    } else {
                                        console.log(code.substring(7 + betPrint.length).replace('print' + betPrint + '(', '').slice(0,-1).slice(0,-1));
                                    }
                                // Print Number
                                } else if (code.replace('print' + betPrint + '(', '')) {
                                    if (code.match(/[0-9]/)) {
                                        var insidePrintN = code.substring(code.indexOf('print' + betPrint + '(') + 6 + betPrint.length, code.indexOf(')'));
                                        console.log(insidePrintN);
                                    // Print Variable
                                    } else {
                                        if (eval('typeof varVariables[varVariablesI] !== "undefined"')) {
                                            if (varVariables[varVariablesI].includes('"')) {
                                                console.log(varVariable[varVariablesI].substring(1).slice(0, - 1))
                                            } else {
                                                var insideVariableName = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                                if (varVariables[varVariablesI].includes('.replace(')) {
                                                    var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                                    var insideVariableName = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                                    var leftString = insideFuncy.substring(insideFuncy.indexOf('(') + 1, insideFuncy.indexOf(',')).replaceAll(' ', '');
                                                    var rightString = insideFuncy.substring(insideFuncy.indexOf(',') + 1, insideFuncy.indexOf(')')).replaceAll(' ', '');
                                                    console.log(varVariables[insideVariableName].replace(leftString, rightString));
                                                }
                                                console.log(varVariables[insideVariableName]);
                                            }
                                        }
                                    }
                                }
                            }
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
                            if (code.substring().includes('.replaceall(')) {
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
                            if (code.substring().includes('.replace(')) {
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
                            if (code.substring().includes('.remove(')) {
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
                            if (code.substring().includes('.removeall(')) {
                                var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                if (insideFuncy.includes('"')) {
                                    leftString = insideFuncy.substring(2).slice(0, - 2);
                                    rightString = '';
                                } else {
                                    smse[8]();
                                    return false;
                                }
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.removeall(')).replaceAll(' ', '');
                                varVariables[variableReplace] = varVariables[variableReplace].replaceAll(leftString, rightString);
                                console.log(varVariables[variableReplace]);
                            }
                            // Slice
                            var leftString;
                            var rightString;
                            if (code.substring().includes('.slice(')) {
                                var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                if (insideFuncy.includes('0' || '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9')) {
                                    leftString = parseInt(insideFuncy.substring(insideFuncy.indexOf('(') + 1, insideFuncy.indexOf(',')).replaceAll(' ', ''));
                                    rightString = parseInt(insideFuncy.substring(insideFuncy.indexOf(',') + 1, insideFuncy.indexOf(')')).replaceAll(' ', ''));
                                }
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.slice(')).replaceAll(' ', '');
                                varVariables[variableReplace] = varVariables[variableReplace].slice(leftString, rightString);
                                console.log(varVariables[variableReplace]);
                            }
                            // Split
                            var leftString;
                            var rightString;
                            if (code.substring().includes('.split(')) {
                                var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                leftString = insideFuncy;
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.split(')).replaceAll(' ', '');
                                varVariables[variableReplace] = varVariables[variableReplace].split(leftString);
                                console.log(varVariables[variableReplace]);
                            }
                            var leftString;
                            if (code.substring().includes('.substring(')) {
                                var insideFuncy = code.substring(code.indexOf('(') + 1, code.indexOf(')'));
                                leftString = parseInt(insideFuncy);
                                var variableReplace = code.substring(code.indexOf('\n') + 1, code.indexOf('.substring(')).replaceAll(' ', '');
                                varVariables[variableReplace] = varVariables[variableReplace].substring(leftString);
                                console.log(varVariables[variableReplace]);
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
                        });
                        // Sounds
                        /*
                        const player = playSound();
                        player.play('', (err) => {
                            if (err) {
                              console.error(err);
                              return;
                            }
                        });
                        */
                    }
                    // Executing the code
                    exeCode(data);
                });
            });
        });
    });
});
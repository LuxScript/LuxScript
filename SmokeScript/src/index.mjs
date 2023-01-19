// Imports
import * as fs from "fs";
import * as url from 'url';

// File imports
import {line, sendError} from './functions.mjs';
import {error, name, variableValue} from './variables.mjs';

// Variables
var __dirname = url.fileURLToPath(new URL('.', import.meta.url));
var varVariables;
var varVariablesI;

// Changing the directory's location
var dir = __dirname.replace('\\' + name + '\\src', '');

// IDK
var dirT = dir + '\\SmokeScript';

// JSON
fs.readFile(dirT + '\\SmokeScriptConfig.json', 'utf8', function(err, index) {

    // JSON Parse
    var index = JSON.parse(index);

    // Reading the project's directory
    fs.readdir(dir + index.Folder.slice(0, - 1), index.ReadingWay, function(err, files) {
    
        // Reading files one by one
        files.forEach(function(files) {
    
            // Reading all the .sms files
            fs.readFile(dir + index.Folder + files, index.ReadingWay, function(err, data) {

                // Big Comments
                var insideBigComments = data.substring(data.indexOf('/*') + 2, data.indexOf('*/'));
                var data = data.replace('/*' + insideBigComments + '*/', '');

                // Accepting all the ''
                data = data.replaceAll("\\'", "\\#0");
                data = data.replaceAll("'", '"');
                data = data.replaceAll('\\#0', "'");
                
                // Reading fully
                var dataF = data;
                dataF = dataF.replaceAll(/^.*\/\/.*$/mg, '');
                
                // Reading each line
                data.split(/\r?\n/).forEach((data) => {

                    // Classes
                    var exeClasses = function () {
                        if (data.substring().startsWith('class ')) {
                            // Getting the name
                            Cname = data.substring(data.indexOf('class ') + 6, data.indexOf('{')).replaceAll(' ', '');
                            class Classes {
                                constructor(cVariable) {
                                  this.cVariable = cVariable;
                                }
                            }
                            if (data.substring().startsWith('new ' + Cname)) {
                                insideClassGet = data.substring(data.indexOf('(') + 1, data.indexOf(')'));
                                newClass = new Classes(insideClassGet);
                                console.log(newClass.cVariable);
                            }
                        }
                    }
                    exeClasses();

                    // Functions
                    var exeFunctions = function () {
                        var functionss;
                        if (data.substring().startsWith('void ')) {
                            // Getting functions name
                            name = data.substring(data.indexOf('void ') + 5, data.indexOf('{')).replaceAll(' ', '');
                            // Getting the code that is in the function
                            codeInFunc = dataF.substring(dataF.indexOf('{') + 1, dataF.indexOf('}'));
                            // The function
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
                                    varVariables = variables;
                                    exeCode(codeInFunc);
                                }
                                // Running the function | If statement not working
                                if (data.includes(name.replaceAll(' ', ''))) {
                                    namel = name.length
                                    nameW = data.substring(data.indexOf('void ') + 5, data.indexOf('('));
                                    nameWE = data.substring(data.indexOf('(') + 1, data.indexOf(')'));
                                    nameWL = nameW.length;
                                    variablesInside = dataF.substring(dataF.indexOf('func(' + nameW + '(') + nameWL + 6, dataF.indexOf('))'));
                                    
                                    // Allowed things
                                    //if (nameW.substring().includes('a' || 'b' || 'c' || 'd' || 'e' || 'f' || 'g' || 'h' || 'i' || 'j' || 'k' || 'l' || 'm' || 'n' || 'o' || 'p' || 'q' || 'r' || 's' || 't' || 'u' || 'v' || 'w' || 'x' || 'y' || 'z' || 'A' || 'B' || 'C' || 'D' || 'E' || 'F' || 'G' || 'H' || 'I' || 'J' || 'K' || 'L' || 'M' || 'N' || 'O' || 'P' || 'Q' || 'R' || 'S' || 'T' || 'U' || 'V' || 'W' || 'X' || 'Y' || 'Z' || '$')) {
                                        if (!dataF.includes('func(' + nameW + '(' + variablesInside + ')' + ')')) {
                                            return false;
                                        }
    
                                        if (nameWE === '') {
                                            if (variablesInside !== '') {
                                                if (dataF.includes('func(' + nameW + '(' + variablesInside + ')' + ')')) {
                                                    sendError('Please set the variable first.');
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
                            
                            // Variables
                            // Var
                            if (code.substring().startsWith('var ')) {
                                varVariables = code.split('=')[1].replaceAll(' ', '');

                                // Removing the "" from the variable.
                                if (varVariables.substring().startsWith('"')) {
                                    if (varVariables.substring().endsWith('"')) {
                                        varVariables = varVariables.substring(1).slice(0, - 1);
                                    }
                                }

                                varVariablesI = code.substring(code.indexOf('var ') + 4, code.indexOf('=')).replaceAll(' ', '');
                            } else {
                            }

                            // Variables in strings
                            if (data.substring().startsWith('{$')) {
                                data = data.replace('{$' + varVariablesI + '}', varVariables);
                            }
                            
                            // Variables Check
                            /*
                            ones = false;
                            if (eval('typeof varVariables !== "undefined"')) {
                            } else {
                                if (ones === false) {
                                    ones = true;
                                    console.log(error + 'Please set the variable first.');
                                } else {
                                    ones = false;
                                }
                            }
                            */

                            // Disable / Enable message viewing in the console
                            if (code.substring().startsWith('%file')) {
                                console.log('Current file: ' + files);
                            }
    
                            // Print
                            if (code.substring().startsWith('print(')) {
    
                                // Print String
                                if (code.substring().replace('print(', '').includes("\"")) {
                                    if (eval('typeof varVariablesI !== "undefined"')) {
                                        console.log(code.substring(7).replace('print(', '').slice(0,-1).slice(0,-1).replace('{$' + varVariablesI + '}', varVariables));
                                    } else {
                                        console.log(code.substring(7).replace('print(', '').slice(0,-1).slice(0,-1));
                                    }
        
                                // Print Number
                                } else if (code.substring().replace('print(', '')) {
                                    if (code.substring().includes('0' || '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9')) {
                                        console.log(code.substring().replace('print(', ''));
                                    
                                    // Print Variable
                                    } else {
                                        if (eval('typeof varVariables !== "undefined"')) {
                                            if (varVariables.includes('"')) {
                                                console.log(varVariables.substring(1).slice(0, - 1))
                                            } else {
                                                if (varVariables.includes('.replace(')) {
                                                    var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                                    var leftString = insideFuncy.substring(insideFuncy.indexOf('(') + 1, insideFuncy.indexOf(',')).replaceAll(' ', '');
                                                    var rightString = insideFuncy.substring(insideFuncy.indexOf(',') + 1, insideFuncy.indexOf(')')).replaceAll(' ', '');
                                                    console.log(varVariables.replace(leftString, rightString));
                                                }
                                                console.log(varVariables);
                                            }
                                        }
                                    }
                                }
                            }
    
                            // FUNCY'S
                            if (code.substring().includes('.replace(')) {
                                var insideFuncy = '(' + code.substring(code.indexOf('(') + 1, code.indexOf(')')) + ')';
                                var leftString = insideFuncy.substring(insideFuncy.indexOf('(') + 1, insideFuncy.indexOf(',')).replaceAll(' ', '');
                                var rightString = insideFuncy.substring(insideFuncy.indexOf(',') + 1, insideFuncy.indexOf(')')).replaceAll(' ', '');
                                //console.log(rightString);
                                //var varVariables = varVariables.replace(leftString, rightString);
                            }
                        });
                    }
    
                    // Executing the code
                    exeCode(data);
    
                    // If statement
                    if (data.substring().startsWith('if')) {
                        
                        // Replacing variable for numbers
                        varVariablesI = dataF.substring(dataF.indexOf('var ') + 4, dataF.indexOf('=')).replaceAll(' ', '');
                        var dt = data;
                        var bt = data.substring(data.indexOf('if') + 2, data.indexOf('('));
                        var dt = dt.replace('if' + bt + '(' + varVariablesI, '');
                        var data = 'if' + bt + '(' + varVariables + dt;
                        var allIf = data.replace('if' + bt + '(', '');
                        var center = allIf.split(' ')[1].replaceAll(' ', '');
                        console.log(center);

                        // Keys
                        HigherThan = '>';
                        LessThan = '<';
                        EqualTo = '===';
                        NotEqualTo = '!==';
                        
                        // If is
                        if (data) {
    
                            // Getting the left number
                            leftNum = data.substring(data.indexOf('(') + 1, data.indexOf(center)).replaceAll(' ', '');
                            if (!leftNum.includes('"')) {
                                leftNum = parseInt(leftNum);
                            }
    
                            // Getting the right number
                            rightNum = data.substring(data.indexOf(center) + 1, data.indexOf(')')).replaceAll(' ', '');
                            if (rightNum.includes('"')) {
                                rightNum = parseInt(rightNum);
                            }
    
                            // Getting inside the if statement
                            /*
                            var inside = dataF.substring(dataF.indexOf('{') + 1, dataF.indexOf('}'));
                            */
    
                            // If execution with all the middles possible
                            if (center === HigherThan) {
                                if (leftNum < rightNum) {
    
                                    // Executing the code inside if
                                    var ifInside = dataF.substring(dataF.indexOf('{') + 1, dataF.indexOf('}')).replaceAll(' ', '');
                                    exeCode(ifInside);
                                }
                            }
    
                            if (center === LessThan) {
                                if (leftNum > rightNum) {
                                    
                                    // Executing the code inside if
                                    var ifInside = dataF.substring(dataF.indexOf('{') + 1, dataF.indexOf('}')).replaceAll(' ', '');
                                    exeCode(ifInside);
                                }
                            }
    
                            if (center === EqualTo) {
                                if (leftNum === rightNum) {
                                    console.log("test");
    
                                    // Executing the code inside if
                                    var ifInside = dataF.substring(dataF.indexOf('{') + 1, dataF.indexOf('}')).replaceAll(' ', '');
                                    exeCode(ifInside);
                                }
                            }
    
                            if (center === NotEqualTo) {
                                if (leftNum !== rightNum) {
    
                                    // Executing the code inside if
                                    var ifInside = dataF.substring(dataF.indexOf('{') + 1, dataF.indexOf('}')).replaceAll(' ', '');
                                    exeCode(ifInside);
                                }
                            }
                        }
                    }
                });
            });
        });
    });
});
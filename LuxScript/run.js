const fs = require("fs");
const { exec } = require('child_process');
const prettier = require('prettier');
const Lexer = require("./lexer.js");
const untokenize = require("./untokenize.js");
const { PUNCTUATION } = require("./Lexer/tokentype.js");
const error = require("./errors");
const { JSDOM } = require("jsdom");

//undefined variables
let htmlData;
let tok12;
let xFunc;// boolean flag?
let yFunc;// boolean flag?

function run(code, file, code2) {
    const input = code;
    const lexer = new Lexer(input);
    const tokens = lexer.lex();
    const result = [];
    let temp = [];

    for (const token of tokens) {
        if (token.type === PUNCTUATION && token.value === "SEMICOLON") {
            result.push(temp);
            temp = [];
        } else {
            temp.push(token);
        }
    }

    if (temp.length > 0) {
        result.push(temp);
    }
    if (temp.length > 0) {
        result.push(temp);
    }
    let tok = result,
        variable = {},
        variableName, imports = {},
        getI = {};
    fs.writeFile("./LuxScript/Transfer/cpp.lxt", JSON.stringify(tok), function(err) {
        if (err) throw err;
    });

    for (var i = 0; i < tok.length; i++) {

        stringVariable();
        // Get
        if (tok[i][0]["value"] === "get") {
            if (tok[i][1]["value"] !== "LEFT_PAREN") {
                if (tok[i][1]["value"].startsWith("./")) {
                    if (tok[i][2] && tok[i][2]["value"] === "AS") {
                        if (tok[i][3]["value"] !== "") {
                            if (fs.existsSync(tok[i][1]["value"])) {
                                variable[tok[i][3]["value"]] = fs.readFileSync(tok[i][1]["value"], "utf8");
                            } else {
                                error[14]();
                                return false;
                            }
                        }
                    } else {
                        if (fs.existsSync(tok[i][1]["value"])) {
                            var file = fs.readFileSync(tok[i][1]["value"], "utf8");
                        } else {
                            error[14]();
                            return false;
                        }
                        if (file === "") {
                            error[9]();
                            return false;
                        }
                        run(file);
                    }
                } else {

                    // Circle
                    if (tok[i][2] && tok[i][2]["value"] === "AS") {
                        if (tok[i][1]["value"] === "circle") {
                            getI[tok[i][1]["value"]] = {
                                circle: true,
                                circleAs: tok[i][3]["value"]
                            };
                        }
                    } else {
                        if (tok[i][1]["value"] === "circle") {
                            getI[tok[i][1]["value"]] = {
                                circle: true,
                                circleAs: "circle"
                            };
                        }
                    }

                    // Http
                    if (tok[i][2] && tok[i][2]["value"] === "AS") {
                        if (tok[i][1]["value"] === "http") {
                            getI[tok[i][1]["value"]] = {
                                http: true,
                                httpAs: tok[i][3]["value"]
                            };
                        }
                    } else {
                        if (tok[i][1]["value"] === "http") {
                            getI[tok[i][1]["value"]] = {
                                http: true,
                                httpAs: "http"
                            };
                        }
                    }

                    // Json
                    if (tok[i][2] && tok[i][2]["value"] === "AS") {
                        if (tok[i][1]["value"] === "json") {
                            getI[tok[i][1]["value"]] = {
                                json: true,
                                jsonAs: tok[i][3]["value"]
                            };
                        }
                    } else {
                        if (tok[i][1]["value"] === "json") {
                            getI[tok[i][1]["value"]] = {
                                json: true,
                                jsonAs: "json"
                            };
                        }
                    }

                    // HtmlVar
                    if (tok[i][2] && tok[i][2]["value"] === "AS") {
                        if (tok[i][1]["value"] === "htmlvar") {
                            getI[tok[i][1]["value"]] = {
                                htmlvar: true,
                                htmlvar: tok[i][3]["value"]
                            };
                        }
                    } else {
                        if (tok[i][1]["value"] === "htmlvar") {
                            getI[tok[i][1]["value"]] = {
                                htmlvar: true,
                                htmlvar: "htmlvar"
                            };
                        }
                    }
                }
            }
        }

        // Fl
        if (tok[i][0]["value"] === "fl") {
            if (tok[i][1]["value"] === "DOT") {
                if (tok[i][2]["value"] === "variable") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4]["type"] === "IDENTIFIER") {
                            tok[i][4]["value"] = variable[tok[i][4]["value"]];
                        }
                        if (fs.existsSync(tok[i][4]["value"])) {
                            htmlData = fs.readFileSync(tok[i][4]["value"], "utf8");
                        } else {
                            error[24]();
                        }

                        function regexEscape(str) {
                            return str.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, "\\{{$1\\}}");
                        }
                        for (let key in variable) {
                            let pattern = new RegExp(`{{\\s*${regexEscape(key)}\\s*}}`, "g");
                            htmlData = htmlData.replace(pattern, variable[key]);
                        }
                        if (tok[i][5]["value"] === "COMMA") {
                            if (tok[i][6]["value"] === "DEF") {
                                if (tok[i][7]["value"] === "LEFT_PAREN") {
                                    variable[tok[i][8]["value"]] = htmlData;
                                }
                            } else {
                                if (tok[i][6]["type"] === "IDENTIFIER") {
                                    tok[i][6]["value"] = variable[tok[i][6]["value"]];
                                }
                                fs.writeFileSync(tok[i][6]["value"], htmlData);
                            }
                        }
                    }
                }
            }
        }

        if (tok[i][0]["value"] === "const") {
            if (tok[i][1]["value"] !== "") {
                if (tok[i][2]["value"] === "ASSIGN") {
                    variable[tok[i][1]["value"]] = tok[i][3]["value"];
                    Object.defineProperty(variable, tok[i][1]["value"], {
                        writable: false,
                    });
                }
            }
        }

        // Sets
        if (tok[i][0]["value"] === "sets") {
            if (tok[i][1]["value"] === "LEFT_BAR") {
                let variablesInside = untokenize(tok[i]).slice(5, -1).split(",");
                let lines = [];

                variablesInside.forEach(variable2 => {
                    const input = variable2;
                    const lexer = new Lexer(input);
                    const tokens2 = lexer.lex();

                    let line = [];
                    tokens2.forEach(token => {
                        if (token.type === 'NEWLINE') {
                            lines.push(line);
                            line = [];
                        } else {
                            line.push(token);
                        }
                    });

                    if (line.length > 0) {
                        lines.push(line);
                    }
                });

                for (var i3 = 0; i3 < lines.length; i3++) {
                    if (lines[i3][1]["value"] === "ASSIGN") {
                        variable[lines[i3][0]["value"]] = lines[i3][2]["value"];
                    }
                }
            }
        }

        // Set
        var value = tok[i][1] && tok[i][1]["value"] || undefined;
        if (tok[i][0]["value"] === "set" && value.trim() !== "" && tok[i][2]["value"] === "ASSIGN" && tok[i][3]["value"] !== "") {
            if (["true", "false", "DEF", "IF"].includes(value)) {
                error[[10, 11, 12, 13][
                    ["true", "false", "DEF", "IF"].indexOf(value)
                ]]();
                return false;
            }
            if (tok[i][3]["type"] === "BOOLEAN") {
                variable[value] = tok[i][3]["value"] === "true";
                variableName = String(Object.keys(variable));
            } else if (tok[i][3]["value"] === "LEFT_PAREN") {
                variable[value] = variable[tok[i][4]["value"]] || {};
                variableName = String(Object.keys(variable));
                if (tok[i][5] && tok[i][5]["value"] === "DOT" && tok[i][6]["value"] !== "") {
                    variable[value] = eval(`variable['${tok[i][4]["value"]}'].${tok[i][6]["value"]}`);
                    variableName = String(Object.keys(variable));
                }
                if (tok[i][4] && tok[i][4]["value"] === "LEFT_BAR" && tok[i][5]["value"] !== "") {
                    variable[value] = eval(`variable['${tok[i][3]["value"]}'].${tok[i][5]["value"]}`);
                    variableName = String(Object.keys(variable));
                }
                if (tok[i][3]["value"] === "NEW" && tok[i][4]["value"] === "date" && tok[i][5]["value"] === "LEFT_PAREN") {
                    variable[value] = new Date();
                    variableName = String(Object.keys(variable));
                }
            } else if (tok[i][3]["value"] === String(Object.keys(variable))) {
                variable[value] = variable[tok[i][3]["value"]];
                variableName = String(Object.keys(variable));
            } else if (tok[i][4] && tok[i][4]["value"] === "PLUS") {
                let result = "";
                for (let j = 2; j < tok[i].length; j += 2) {
                    if (tok[i][j + 1]["type"] === "IDENTIFIER") {
                        tok[i][j + 1]["value"] = variable[tok[i][j + 1]["value"]];
                    }
                    result += tok[i][j + 1]["value"];
                }
                variable[value] = result;
                variableName = String(Object.keys(variable));
            } else {
                if (tok[i][3]["value"] === "calc" && tok[i][4]["value"] === "LEFT_PAREN") {
                    const result = tok[i].slice(5, -1);
                    for (const elem of result) {
                        if (elem["type"] === "STRING") {
                            error[22]();
                            return false;
                        }
                    }
                    if (result[0]["type"] === "IDENTIFIER") {
                        result[0]["value"] = variable[result[0]["value"]];
                    }
                    if (result[2]["type"] === "IDENTIFIER") {
                        result[2]["value"] = variable[result[2]["value"]];
                    }
                    const expression = untokenize(result);
                    const resultValue = eval(expression);
                    tok[i][3]["value"] = resultValue;
                }
                if (tok[i][3]["value"] === "MINUS") {
                    variable[value] = parseInt("-" + tok[i][4]["value"]); // Normal set
                    variableName = String(Object.keys(variable));
                } else {
                    if (tok[i][3]["value"] === "LEFT_BAR") {
                        let [, , , , ...tok9] = tok[i].slice(0, -1);
                        let values = [];
                        for (let token of tok9) {
                            values.push(token.value);
                        }
                        let combinedString = values.join("");
                        let numbers = combinedString.split("COMMA");
                        let jsonString = "[" + numbers.join(",") + "]";
                        variable[value] = JSON.parse(jsonString);
                        variableName = String(Object.keys(variable));
                        return false;
                    }
                    if (tok[i][tok[i].length - 2]["value"] === "GO_RIGHT") {
                        if (tok[i][3]["type"] === "IDENTIFIER") {
                            tok[i][3]["value"] = variable[tok[i][3]["value"]];
                        }
                        if (tok[i][tok[i].length - 1]["type"] === "IDENTIFIER") {
                            tok[i][tok[i].length - 1]["value"] = variable[tok[i][tok[i].length - 1]["value"]];
                        }
                        variable[value] = tok[i][3]["value"].substring(tok[i][tok[i].length - 1]["value"]); // Normal set
                        variableName = String(Object.keys(variable));
                    } else if (tok[i][tok[i].length - 2]["value"] === "GO_LEFT") {
                        if (tok[i][3]["type"] === "IDENTIFIER") {
                            tok[i][3]["value"] = variable[tok[i][3]["value"]];
                        }
                        if (tok[i][tok[i].length - 1]["type"] === "IDENTIFIER") {
                            tok[i][tok[i].length - 1]["value"] = variable[tok[i][tok[i].length - 1]["value"]];
                        }
                        variable[value] = tok[i][3]["value"].slice(0, -tok[i][tok[i].length - 1]["value"]); // Normal set
                        variableName = String(Object.keys(variable));
                    } else if (tok[i][tok[i].length - 2]["value"] === "GO_FRONT_BOTH") {
                        if (tok[i][3]["type"] === "IDENTIFIER") {
                            tok[i][3]["value"] = variable[tok[i][3]["value"]];
                        }
                        if (tok[i][tok[i].length - 1]["type"] === "IDENTIFIER") {
                            tok[i][tok[i].length - 1]["value"] = variable[tok[i][tok[i].length - 1]["value"]];
                        }
                        if (tok[i][tok[i].length - 1]["type"] === "IDENTIFIER") {
                            tok[i][tok[i].length - 1]["value"] = variable[tok[i][tok[i].length - 1]["value"]];
                        }
                        variable[value] = tok[i][3]["value"].slice(0, -tok[i][tok[i].length - 1]["value"]).substring(tok[i][tok[i].length - 1]["value"]); // Normal set
                        variableName = String(Object.keys(variable));
                    } else if (tok[i][tok[i].length - 2]["value"] === "GO_BACK_BOTH") {
                        if (tok[i][3]["type"] === "IDENTIFIER") {
                            tok[i][3]["value"] = variable[tok[i][3]["value"]];
                        }
                        if (tok[i][tok[i].length - 1]["type"] === "IDENTIFIER") {
                            tok[i][tok[i].length - 1]["value"] = variable[tok[i][tok[i].length - 1]["value"]];
                        }
                        if (tok[i][tok[i].length - 1]["type"] === "IDENTIFIER") {
                            tok[i][tok[i].length - 1]["value"] = variable[tok[i][tok[i].length - 1]["value"]];
                        }
                        variable[value] = tok[i][3]["value"].substring(tok[i][tok[i].length - 1]["value"]).slice(0, -tok[i][tok[i].length - 1]["value"]); // Normal set
                        variableName = String(Object.keys(variable));
                    } else if (tok[i][tok[i].length - 2]["value"] === "apo") {
                        if (tok[i][3]["type"] === "IDENTIFIER") {
                            tok[i][3]["value"] = variable[tok[i][3]["value"]];
                        }
                        let str = tok[i][3]["value"];
                        if (tok[i][tok[i].length - 3]["type"] === "IDENTIFIER") {
                            tok[i][tok[i].length - 3]["value"] = variable[tok[i][tok[i].length - 3]["value"]];
                        }
                        const percent = tok[i][tok[i].length - 1]["value"];
                        const length = str.length;
                        const percentLength = Math.ceil(length * (percent / 100));
                        const percentSubstring = str.substring(0, percentLength);
                        variable[value] = percentSubstring;
                        variableName = String(Object.keys(variable));
                    } else {
                        variable[value] = tok[i][3]["value"]; // Normal set
                        variableName = String(Object.keys(variable));
                    }
                }
                if (tok[i][4] && tok[i][4]["value"] === "DOT" && tok[i][5]["value"] !== "") {
                    variable[value] = eval(`variable['${tok[i][3]["value"]}'].${tok[i][5]["value"]}`);
                    variableName = String(Object.keys(variable));
                }
                if (tok[i][4] && tok[i][4]["value"] === "LEFT_BAR" && tok[i][5]["value"] !== "") {
                    variable[value] = eval(`variable['${tok[i][3]["value"]}'].${tok[i][5]["value"]}`);
                    variableName = String(Object.keys(variable));
                }
                if (tok[i][3]["value"] === "NEW" && tok[i][4]["value"] === "date" && tok[i][5]["value"] === "LEFT_PAREN") {
                    variable[value] = new Date();
                    variableName = String(Object.keys(variable));
                }
                if (tok[i][3]["value"] === "LEFT_BRACE") {
                    let [, , ...jsonCode] = tok[i];
                    jsonCode.shift();
                    variable[tok[i][1]["value"]] = JSON.parse(untokenize(jsonCode));
                    variableName = String(Object.keys(variable));
                }
            }
        }


        // Base variables
        variable["dirpath"] = __dirname;
        variable["filepath"] = __filename;
        variable["infinity"] = Infinity;
        variable["ninfinity"] = -Infinity;
        variable["undefined"] = undefined;
        variable["nan"] = NaN;
        variable["null"] = null;
        variable["FILE"] = code2;

        function stringVariable() {
            for (let j = 0; j < tok[i].length; j++) {
                if (tok[i][j]["type"] === "STRING") {
                    if (/\{(.+?)\}/.test(tok[i][j]["value"])) {
                        tok[i][j]["value"] = tok[i][j]["value"].replace(/\{(.+?)\}/g, function(match, p1) {
                            if (p1.includes(".")) {
                                p2 = p1.split(".");
                                return variable[p2[0]][p2[1]] || "";
                                /*
                                } else if (p1.includes("[") and "]") {
                                  use []
                                */
                            } else {
                                return variable[p1] || "";
                            }
                        });
                    }
                }
            }
        }
        stringVariable();

        if (tok[i][0]["value"] === "def") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                variable[tok[i][2]["value"]] = variable[tok[i][2]["value"]];
            }
        }

        var functions = {};
        var functionName;

        if (tok[i][0]["value"] === "DEF") {
            if (tok[i][1]["value"] !== "") {
                if (tok[i][2]["value"] === "LEFT_PAREN") {
                    functionName = tok[i][1]["value"];
                    // Add a new property to the functions object
                    functions[functionName] = function(...FuncVar) {
                        tok12 = [...tok[i]]
                        tok12.shift();
                        tok12.shift();
                        tok12.shift();
                        tok12.pop();
                        tok12.pop();
                        tok12.pop();
                        tok12.pop();
                        tok12.pop();
                        tok12.pop();
                        const keys = untokenize(tok12).split(",");
                        for (let i = 0; i < keys.length; i++) {
                            variable[keys[i]] = FuncVar[0][i];
                        }
                        tok[i].splice(0, 5);
                        run(untokenize(tok[i]));
                    };
                    runFunc();
                }
            }
        }

        function runFunc() {
            xFunc = true;
        }

        const lastTok = tok[tok.length - 1];
        if (lastTok[0]["value"] === "run") {
            yFunc = true;
        } else {
            yFunc = false;
        }
        if (yFunc === true) {
            if (xFunc === true) {
                if (functions.hasOwnProperty(functionName)) { // check if the functions object has the property
                    // lasttok[2] is the value inside the run function
                    lastTok.shift();
                    lastTok.shift();
                    lastTok.shift();
                    lastTok.shift();
                    lastTok.pop();
                    lastTok.pop();
                    lastTok.forEach(function(lT) {
                        ltv = lT["value"];
                        if (lT["type"] === "IDENTIFIER") {
                            console.log(variable)
                            console.log(variable[ltv])
                        }
                    });
                    const arr = untokenize(lastTok).split(",");
                    const plainArr = arr.map(str => str.replace(/"/g, ''));
                    myFuncy(plainArr);
                }
            }
        }

        function myFuncy(functionVariables) {
            if (functions.hasOwnProperty(functionName)) { // check if the functions object has the property
                functions[functionName](functionVariables);
            }
        }

        // Loops
        function loops() {
            if (tok[i][0]["value"] === "loop") {
                if (tok[i][1]["value"] === "LEFT_PAREN") {
                    if (tok[i][2]["value"] === "DEF") {
                        if (tok[i][6]["value"] === "COMMA") {
                            if (tok[i][7]["value"] !== "") {
                                if (tok[i][8]["value"] === "COMMA") {
                                    let num = tok[i][9]["value"];
                                    for (var loop = tok[i][7]["value"]; loop < num; loop++) {
                                        console.log(tok[i][4]["value"]);
                                        variableName = tok[i][4]["value"];
                                        variable[tok[i][4]["value"]] = {};
                                        variable[tok[i][4]["value"]] = i;
                                        const index = tok[i].findIndex((token) => token["value"] === "LEFT_BRACE");
                                        const remainingTokens = tok[i].slice(index + 1);
                                        tok[i] = remainingTokens;
                                        run(untokenize(tok[i]));
                                    }
                                }
                            }
                        }
                    }
                } else if (tok[i][1]["value"] === "LEFT_BRACE") {
                    console.log(tok[i])
                    for (;;) {
                        const index = tok[i].findIndex((token) => token["value"] === "LEFT_BRACE");
                        const remainingTokens = tok[i].slice(index + 1);
                        tok[i] = remainingTokens;
                        run(untokenize(tok[i]));
                    }
                }
            }
        }
        loops();

        fs.writeFile("./LuxScript/Transfer/cppvar.lxt", JSON.stringify(variable), function(err) {
            if (err) throw err;
        });

        // Change value of variable with variable name
        if (tok[i][0]["value"] === variableName) {
            if (tok[i][1]["value"] === "DOT") {
                if (tok[i][2]["value"] === "split") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        variable[tok[i][0]["value"]] = variable[tok[i][0]["value"]].split(tok[i][4]["value"]);
                        variableName = String(Object.keys(variable));
                    }
                }
            }
            const varValue = variable[tok[i][0]["value"]];
            switch (tok[i][1]["value"]) {
                case "REALLY_EQUALS":
                    console.log(varValue === tok[i][2]["value"]);
                    break;
                case "REALLY_NOT_EQUALS":
                    console.log(varValue !== tok[i][2]["value"]);
                    break;
                case "EQUALS":
                    console.log(varValue == tok[i][2]["value"]);
                    break;
                case "NOT_EQUALS":
                    console.log(varValue != tok[i][2]["value"]);
                    break;
                case "LESS_THAN":
                    console.log(varValue < tok[i][2]["value"]);
                    break;
                case "LESS_THAN_EQUALS":
                    console.log(varValue <= tok[i][2]["value"]);
                    break;
                case "GREATER_THAN":
                    console.log(varValue > tok[i][2]["value"]);
                    break;
                case "GREATER_THAN_EQUALS":
                    console.log(varValue >= tok[i][2]["value"]);
                    break;
                case "PLUS_ASSIGN":
                    variable[variableName] += tok[i][2]["value"];
                    break;
                case "MINUS_ASSIGN":
                    variable[variableName] -= tok[i][2]["value"];
                    break;
                default:
                    variable[variableName] = tok[i][2]["value"];
                    variableName = String(Object.keys(variable));
                    break;
            }

            if (tok[i][3] && tok[i][3]["value"] === "DOT") {
                if (tok[i][4]["value"] !== "") {
                    eval(`variable["${tok[i][0]["value"]}"] = variable['${tok[i][2]["value"]}'].${tok[i][4]["value"]}`);
                }
            } else if (tok[i][3] && tok[i][3]["value"] === "LEFT_BAR") {
                if (tok[i][4]["value"] !== "") {
                    eval(`console.log(variable['${tok[i][2]["value"]}']["${tok[i][4]["value"]}"])`);
                    break;
                }
            }
        }

        // Options
        if (tok[i][0]["value"] === "Options") {
            let [, ...toky] = tok[i];
            toky.pop()
            toky.pop()
            toky.pop()
            toky.pop()
            toky.pop()
            toky.pop()
            if (toky[0]["value"] === "LEFT_BRACE") {
                let tokyOpt = tok[i].slice(toky.length);
                variable[tokyOpt[4]["value"]] = JSON.parse(untokenize(toky));
            }
        }

        if (tok[i][0]["value"] === "bin") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                const {
                    exec
                } = require('child_process');
                // Replace "binary code here" with your binary code string
                const binaryCode = "binary code here";
                const binaryBuffer = Buffer.from(binaryCode, 'binary');

                // Execute the binary code using the "exec" method
                exec(binaryBuffer, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing binary code: ${error}`);
                        return;
                    }
                    console.log(`Standard output: ${stdout}`);
                    console.error(`Standard error: ${stderr}`);
                });
            }
        }

        /*
        DOCUMENT MONIPULATION
        */
        if (tok[i][0]["value"] === "lxdom") {
            var lxdom2 = true;
        }
        if (lxdom2 === true) {
            lxdom(tok[i]);
        }

        function lxdom(tok) {
            let dir = __dirname.slice(0, -10);
            // Document information variables used in this function
            let documenttitle;
            let documentdoctype;
            let documentaddhtmlhead;
            let documentaddhtmlbody;
            let documentaddhtml;
            let documentaddcss;
            let documentaddscript;
            let documentlang;

            if (tok[0]["value"] === "DOCUMENT") {
                if (tok[1]["value"] === "DOT") {
                    const dom = new JSDOM();
                    const document = dom.window.document;

                    // Checking if the document is used.
                    if (tok[2]["value"] === "title" && tok[3]["value"] === "LEFT_PAREN") {
                        if (tok[4]["type"] === "IDENTIFIER") {
                            documenttitle = variable[tok[4]["value"]];
                        } else {
                            documenttitle = tok[4]["value"];
                        }
                    }

                    if (tok[2]["value"] === "doctype" && tok[3]["value"] === "LEFT_PAREN") {
                        documentdoctype = "";
                    }

                    if (tok[2]["value"] === "addhtml" && tok[3]["value"] === "DOT" && tok[4]["value"] == "head" && tok[5]["value"] == "LEFT_PAREN") {
                        if (tok[6]["type"] === "IDENTIFIER") {
                            documentaddhtmlhead = variable[tok[6]["value"]];
                        } else {
                            documentaddhtmlhead = tok[6]["value"];
                        }
                    }

                    if (tok[2]["value"] === "addhtml" && tok[3]["value"] === "DOT" && tok[4]["value"] == "body" && tok[5]["value"] == "LEFT_PAREN") {
                        if (tok[6]["type"] === "IDENTIFIER") {
                            documentaddhtmlbody = variable[tok[6]["value"]];
                        } else {
                            documentaddhtmlbody = tok[6]["value"];
                        }
                    }

                    if (tok[2]["value"] === "addhtml" && tok[3]["value"] === "LEFT_PAREN") {
                        if (tok[4]["type"] === "IDENTIFIER") {
                            documentaddhtml = variable[tok[4]["value"]];
                        } else {
                            documentaddhtml = tok[4]["value"];
                        }
                    }

                    if (tok[2]["value"] === "addcss" && tok[3]["value"] === "LEFT_PAREN") {
                        if (tok[4]["type"] === "IDENTIFIER") {
                            documentaddcss = variable[tok[4]["value"]];
                        } else {
                            documentaddcss = tok[4]["value"];
                        }
                    }

                    if (tok[2]["value"] === "addscript" && tok[3]["value"] === "LEFT_PAREN") {
                        if (tok[4]["type"] === "IDENTIFIER") {
                            documentaddscript = variable[tok[4]["value"]];
                        } else {
                            documentaddscript = tok[4]["value"];
                        }
                    }

                    if (tok[2]["value"] === "lang" && tok[3]["value"] === "LEFT_PAREN") {
                        if (tok[4]["type"] === "IDENTIFIER") {
                            documentlang = variable[tok[4]["value"]];
                        } else {
                            documentlang = tok[4]["value"];
                        }
                    }

                    // Executing the document.
                    if (tok[2]["value"] === "create" && tok[3]["value"] === "LEFT_PAREN") {
                        let html = document.documentElement.outerHTML;
                        if (typeof documentaddhtml !== 'undefined') {
                            dom.window.document.innerHTML = documentaddhtml;
                        }
                        if (typeof documentaddhtmlbody !== 'undefined') {
                            dom.window.document.body.innerHTML = documentaddhtmlbody;
                        }
                        if (typeof documentaddhtmlhead !== 'undefined') {
                            dom.window.document.head.innerHTML = documentaddhtmlhead;
                        }
                        if (typeof documenttitle !== 'undefined') {
                            document.title = documenttitle;
                        }
                        if (typeof documentlang !== 'undefined') {
                            document.documentElement.setAttribute("lang", documentlang);
                            html = dom.serialize();
                        }
                        if (typeof documentaddcss !== 'undefined') {
                            const style = document.createElement('style');
                            style.textContent = documentaddcss;
                            document.head.appendChild(style);
                        }
                        if (typeof documentaddscript !== 'undefined') {
                            const script = document.createElement('script');
                            script.textContent = documentaddscript;
                            document.head.appendChild(script);
                        }
                        if (typeof documentdoctype !== 'undefined') {
                            html = "<!DOCTYPE html>" + document.documentElement.outerHTML;
                        }
                        const formattedHtml = prettier.format(html, {
                            parser: "html"
                        });

                        if (tok[4] && tok[4]["value"] !== "RIGHT_PAREN") {
                            if (tok[4]["value"].endsWith(".html")) {
                                fs.writeFileSync(dir + "\\" + tok[4]["value"], formattedHtml);
                            } else {
                                fs.writeFileSync(dir + "\\" + tok[4]["value"] + ".html", formattedHtml);
                            }
                        } else {
                            fs.writeFileSync(dir + "\\LuxScript.html", formattedHtml);
                        }



                    } else if (tok[2]["value"] === "extract" && tok[3]["value"] === "LEFT_PAREN") {
                        if (typeof documentaddhtml !== 'undefined') {
                            dom.window.document.body.innerHTML = documentaddhtml;
                        }
                        if (typeof documentaddhtmlbody !== 'undefined') {
                            dom.window.document.body.innerHTML = documentaddhtmlbody;
                        }
                        if (typeof documentaddhtmlhead !== 'undefined') {
                            dom.window.document.head.innerHTML = documentaddhtmlhead;
                        }
                        if (typeof documenttitle !== 'undefined') {
                            document.title = documenttitle;
                        }
                        if (typeof documentaddcss !== 'undefined') {
                            const style = document.createElement('style');
                            style.textContent = documentaddcss;
                            document.head.appendChild(style);
                        }
                        if (typeof documentaddscript !== 'undefined') {
                            const script = document.createElement('script');
                            script.textContent = documentaddscript;
                            document.head.appendChild(script);
                        }
                        const html = document.documentElement.outerHTML;
                        const formattedHtml = prettier.format(html, {
                            parser: "html"
                        });

                        if (tok[6]["type"] === "IDENTIFIER") {
                            var xx = true;
                        }
                        if (xx === true) {
                            variable[tok[6]["value"]] = formattedHtml;
                        }
                    }
                }
            }
        }

        // Convertion
        if (tok[i][0]["value"] === "string") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                variable[tok[i][2]["value"]] = String(variable[tok[i][2]["value"]]);
            }
        }
        if (tok[i][0]["value"] === "int") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                if (/^\d+$/.test(variable[tok[i][2]["value"]])) {
                    variable[tok[i][2]["value"]] = Number(variable[tok[i][2]["value"]]);
                } else {
                    error[21]();
                    return false;
                }
            }
        }

        // Scope
        if (tok[i][0]["value"] === "scope") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                run(`set ${tok[i][2]["value"]} = ${tok[i][2]["value"]};`);
            }
        }

        // Print
        if (tok[i][0]["value"] === "print") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                if (tok[i][2]["value"] === "calc" && tok[i][3]["value"] === "LEFT_PAREN") {
                    const result = tok[i].slice(4, -2);
                    for (const elem of result) {
                        if (elem["type"] === "STRING") {
                            error[22]();
                            return false;
                        }
                    }
                    if (result[0]["type"] === "IDENTIFIER") {
                        result[0]["value"] = variable[result[0]["value"]];
                    }
                    if (result[2]["type"] === "IDENTIFIER") {
                        result[2]["value"] = variable[result[2]["value"]];
                    }
                    const expression = untokenize(result);
                    const resultValue = eval(expression);
                    console.log(resultValue)
                    return false;
                }

                // Json
                if (tok[i][3] && tok[i][3]["value"] === "DOT") {
                    if (tok[i][4]["value"] !== "") {
                        eval(`console.log(variable['${tok[i][2]["value"]}'].${tok[i][4]["value"]})`);
                        break;
                    }
                } else if (tok[i][3] && tok[i][3]["value"] === "LEFT_BAR") {
                    if (tok[i][4]["value"] !== "") {
                        eval(`console.log(variable['${tok[i][2]["value"]}']["${tok[i][4]["value"]}"])`);
                        break;
                    }
                }

                // Date
                if (tok[i][2]["value"] === "NEW") {
                    if (tok[i][3]["value"] === "date") {
                        if (tok[i][4]["value"] === "LEFT_PAREN") {
                            console.log(new Date());
                        }
                    }
                }
                if (tok[i][2]["type"] === "BOOLEAN") {
                    console.log(Boolean(tok[i][2]["value"]))
                }
                if (tok[i][2]["type"] === "IDENTIFIER") {
                    if (variable[tok[i][2]["value"]] === "true") {
                        console.log(Boolean(variable[tok[i][2]["value"]]));
                    } else if (variable[tok[i][2]["value"]] === "false") {
                        console.log(Boolean(variable[tok[i][2]["value"]]));
                    } else {
                        console.log(variable[tok[i][2]["value"]]);
                    }
                }
                if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "STRINGVAR" || tok[i][2]["type"] === "NUMBER") {
                    console.log(tok[i][2]["value"]);
                }
            }
            if (tok[i][1]["value"] === "DOT") {

                if (tok[i][2]["value"] === "error") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.error(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][2]["type"] === "NUMBER") {
                                    console.error(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "color") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "COMMA") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    tok[i][4]["value"] = variable[tok[i][4]["value"]]
                                }
                                if (tok[i][6]["type"] === "IDENTIFIER") {
                                    tok[i][6]["value"] = variable[tok[i][6]["value"]]
                                }
                                console.log(`\x1b[${tok[i][4]["value"]}m%s\x1b[0m`, tok[i][6]["value"]);
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "link") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.log('\u001b[33m%s\u001b[0m', variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][2]["type"] === "NUMBER") {
                                    console.log('%s', tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "stdout") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    process.stdout.write(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][2]["type"] === "NUMBER") {
                                    process.stdout.write(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "warn") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.warn(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.warn(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "assert") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.assert(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.assert(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "count") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                console.count(tok[i][4]["value"]);
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "countreset") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.countReset(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.countReset(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "debug") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.debug(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.debug(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "dir") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.dir(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.dir(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "dirxml") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.dirxml(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.dirxml(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "group") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.group(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.group(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "info") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.info(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.info(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "groupcollapsed") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.groupCollapsed(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.groupCollapsed(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "profile") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.profile(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.profile(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "profileend") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.profileEnd(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.profileEnd(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "table") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.table(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.table(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "time") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.time(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.time(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "timeend") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.timeEnd(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.timeEnd(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "timelog") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.timeLog(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.timeLog(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "timestamp") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.timeStamp(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.timeStamp(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "trace") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4] !== "") {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][4]["type"] === "IDENTIFIER") {
                                    console.trace(variable[tok[i][4]["value"]])
                                }
                                if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][4]["type"] === "NUMBER") {
                                    console.trace(tok[i][4]["value"]);
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "clear") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4]["value"] === "RIGHT_PAREN") {
                            console.clear();
                        }
                    }
                }
            }
        }

        // Eval     
        if (tok[i][0]["value"] === "exe") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                tok[i].shift();
                tok[i].shift();
                if (tok[i][0]["type"] === "IDENTIFIER") {
                    tok[i][0]["value"] = variable[tok[i][0]["value"]];
                }
                const input = tok[i];
                const lexer = new Lexer(input);
                const tokens = lexer.lex();
                run(untokenize(tok[i]));
            }
        }

        // Shell command
        if (tok[i][0]["value"] === "exec") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                if (tok[i][2]["type"] === "IDENTIFIER") {
                    tok[i][2]["value"] = variable[tok[i][2]["value"]];
                }
                exec(tok[i][2]["value"], (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    if (stdout) {
                        console.log(stdout);
                    }
                    if (stderr) {
                        console.error(stderr);
                    }
                });
            }
        }

        // Html
        if (tok[i][0]["value"] === "app") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                if (tok[i][2]["type"] === "IDENTIFIER") {
                    var value = variable[tok[i][2]["value"]];
                } else {
                    var value = tok[i][2]["value"];
                }
                fs.writeFileSync("./LuxScript/index.html", value);
                exec("npx electron ./LuxScript/main.ejs.js", (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    if (stdout) {
                        console.log(stdout);
                    }
                    if (stderr) {
                        console.error(stderr);
                    }
                });
            } else if (tok[i][1]["value"] === "DOT") {
                if (tok[i][2]["value"] === "title") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4]["type"] === "IDENTIFIER") {
                            var value = variable[tok[i][4]["value"]];
                        } else {
                            var value = tok[i][4]["value"];
                        }
                        fs.writeFileSync("./LuxScript/Transfer/transferTitle.lxt", value);
                    }
                }
                if (tok[i][2]["value"] === "icon") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4]["type"] === "IDENTIFIER") {
                            var value = variable[tok[i][4]["value"]];
                        } else {
                            var value = tok[i][4]["value"];
                        }
                        fs.writeFileSync("./LuxScript/Transfer/transferLogo.lxt", value);
                    }
                }
            }
        }

        // Python
        if (tok[i][0]["value"] === "python") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                if (tok[i][2]["type"] === "IDENTIFIER") {
                    tok[i][2]["value"] = variable[tok[i][2]["value"]];
                }
                exec("python " + tok[i][2]["value"], (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    if (stdout) {
                        console.log(stdout);
                    }
                    if (stderr) {
                        console.error(stderr);
                    }
                });
            } else if (tok[i][1]["value"] === "DOT") {
                if (tok[i][2]["value"] === "run") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4]["type"] === "IDENTIFIER") {
                            tok[i][4]["value"] = variable[tok[i][4]["value"]];
                        }
                        exec("python -c " + tok[i][4]["value"], (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                return;
                            }
                            if (stdout) {
                                console.log(stdout);
                            }
                            if (stderr) {
                                console.error(stderr);
                            }
                        });
                    }
                }
            }
        }

        // Node.js
        if (tok[i][0]["value"] === "node") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                if (tok[i][2]["type"] === "IDENTIFIER") {
                    tok[i][2]["value"] = variable[tok[i][2]["value"]];
                }
                exec("node " + tok[i][2]["value"], (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    if (stdout) {
                        console.log(stdout);
                    }
                    if (stderr) {
                        console.error(stderr);
                    }
                });
            } else if (tok[i][1]["value"] === "DOT") {
                if (tok[i][2]["value"] === "run") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][4]["type"] === "IDENTIFIER") {
                            tok[i][4]["value"] = variable[tok[i][4]["value"]];
                        }
                        exec("node -e " + tok[i][4]["value"], (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                return;
                            }
                            if (stdout) {
                                console.log(stdout);
                            }
                            if (stderr) {
                                console.error(stderr);
                            }
                        });
                    }
                }
            }
        }

        // Json
        if (tok[i][0]["value"] === "json") {
            if (tok[i][1]["value"] === "DOT") {
                if (tok[i][2]["value"] === "parse") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        variable[tok[i][4]["value"]] = JSON.parse(variable[tok[i][4]["value"]]);
                    }
                } else if (tok[i][2]["value"] === "stringify") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        variable[tok[i][4]["value"]] = JSON.stringify(variable[tok[i][4]["value"]]);
                    }
                }
            }
        }

        // Webserver
        eval(fs.readFileSync("./LuxScript/Functions/Webserver.js", "utf8"));

        // Circle
        eval(fs.readFileSync("./LuxScript/Functions/Circle.js", "utf8"));

        // Return
        if (tok[i][0]["value"] === "return") {
            if (tok[i][1]["value"] === "false") {
                return false;
            }
            if (tok[i][1]["value"] === "true") {
                return true;
            }
            if (tok[i][1]["type"] === "NUMBER") {
                return tok[i][1]["value"];
            } else {
                run(untokenize(tok[i].slice(1)));
            }
        }

        // Switch case
        eval(fs.readFileSync("./LuxScript/Functions/SwitchCase.js", "utf8"));

        // Break
        if (tok[i][0]["value"] === "break") {
            break;
        }

        // Exit
        if (tok[i][0]["value"] === "exit") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                if (tok[i][2]["value"] !== "") {
                    process.exit(tok[i][2]["value"]);
                }
            }
        }

        // Calc
        if (tok[i][0]["value"] === "calc" && tok[i][1]["value"] === "LEFT_PAREN") {
            const result = tok[i].slice(2, -1);
            for (const elem of result) {
                if (elem["type"] === "STRING") {
                    error[22]();
                    return false;
                }
            }
            if (result[0]["type"] === "IDENTIFIER") {
                result[0]["value"] = variable[result[0]["value"]];
            }
            if (result[2]["type"] === "IDENTIFIER") {
                result[2]["value"] = variable[result[2]["value"]];
            }
            const expression = untokenize(result);
            const resultValue = eval(expression);
            console.log(resultValue);
        }

        // Whido
        if (tok[i][0]["value"] === "WHIDO") {
            if (tok[i][1]["value"] === "LEFT_PAREN") {
                let [, , ...insideWhile] = tok[i];
                insideWhile.pop();
                insideWhile.pop();
                insideWhile.pop();
                insideWhile.pop();
                insideWhile.pop();
                insideWhile.pop();
                if (tok[i][6]["value"] === "LEFT_BRACE") {
                    let insideBrace = tok[i];
                    insideBrace.shift();
                    insideBrace.shift();
                    insideBrace.shift();
                    insideBrace.shift();
                    insideBrace.shift();
                    insideBrace.shift();
                    insideBrace.shift();
                    do {
                        run(untokenize(insideBrace))
                    } while (untokenize(insideWhile))
                }
            }
        }

        // File
        if (tok[i][0]["value"] === "file") {
            if (tok[i][1]["value"] === "DOT") {
                if (tok[i][2]["value"] === "read") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][5]["value"] === "COMMA") {
                            if (tok[i][6]["value"] === "DEF") {
                                if (tok[i][7]["value"] === "LEFT_PAREN") {
                                    var name = tok[i][8]["value"];
                                    if (fs.existsSync(tok[i][4]["value"])) {
                                        var data = fs.readFileSync(tok[i][4]["value"], "utf8");
                                        variable[name] = data;
                                    } else {
                                        error[14]();
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "write") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][5]["value"] === "COMMA") {
                            if (fs.existsSync(tok[i][4]["value"])) {
                                fs.writeFileSync(tok[i][4]["value"], tok[i][6]["value"]);
                            } else {
                                error[15]();
                                return false;
                            }
                        }
                    }
                }
                if (tok[i][2]["value"] === "mkdir") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (fs.existsSync(tok[i][4]["value"])) {
                            error[16]();
                            return false;
                        } else {
                            fs.mkdirSync(tok[i][4]["value"]);
                        }
                    }
                }
                if (tok[i][2]["value"] === "rmfile") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (fs.existsSync(tok[i][4]["value"])) {
                            fs.unlinkSync(tok[i][4]["value"]);
                        } else {
                            error[17]();
                        }
                    }
                }
                if (tok[i][2]["value"] === "rmdir") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (fs.existsSync(tok[i][4]["value"])) {
                            fs.rmdirSync(tok[i][4]["value"]);
                        } else {
                            error[18]();
                        }
                    }
                }
                if (tok[i][2]["value"] === "scan") {
                    if (tok[i][3]["value"] === "LEFT_PAREN") {
                        if (tok[i][5]["value"] === "RIGHT_PAREN") {
                            fs.stat(tok[i][4]["value"], function(err, stat) {
                                if (err == null) {
                                    return console.log(true);
                                } else if (err.code === 'ENOENT') {
                                    return console.log(false);
                                } else {
                                    error[4]();
                                    return false;
                                }
                            });
                        }
                    }
                }
            }
        }

        // While statement
        function whileState() {
            if (tok[i][0]["value"] === "WHILE") {
                if (tok[i][1]["value"] === "LEFT_PAREN") {
                    if (tok[i][3]["value"] === "EQUALS") {
                        while (tok[i][2]["value"] === (tok[i][4] && tok[i][4]["value"])) {
                            if (tok[i][5]["value"] === "RIGHT_PAREN") {
                                if (tok[i][6]["value"] === "LEFT_BRACE") {
                                    const index = tok[i].findIndex((token) => token["value"] === "LEFT_BRACE");
                                    const remainingTokens = tok[i].slice(index + 1);
                                    tok[i] = remainingTokens;
                                    run(untokenize(tok[i]));
                                }
                            }
                        }
                    }
                }
            }
        }
        whileState();

        // If statement
        let elseTok = tok;

        function ifState() {
            if (tok[i].length > 0 && tok[i][0]["value"] === "IF") {
                if (tok[i][1]["value"] === "LEFT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                        tok[i][2]["value"] = variable[tok[i][2]["value"]];
                    }
                    if (tok[i][4]["type"] === "IDENTIFIER") {
                        tok[i][4]["value"] = variable[tok[i][4]["value"]];
                    }
                    var newTokens = tok[i].slice(tok[i].indexOf(tok[i][6]));
                    var tokb = newTokens.slice(1);
                    var FirstNumber = tok[i][2]["value"];
                    var Operator = tok[i][3]["value"];
                    var SecondNumber = tok[i][4]["value"];
                    var code = tokb;
                } else {
                    if (tok[i][1]["type"] === "IDENTIFIER") {
                        tok[i][1]["value"] = variable[tok[i][1]["value"]];
                    }
                    if (tok[i][3]["type"] === "IDENTIFIER") {
                        tok[i][3]["value"] = variable[tok[i][3]["value"]];
                    }
                    var newTokens = tok[i].slice(tok[i].indexOf(tok[i][5]));
                    var tokb = newTokens;
                    var FirstNumber = tok[i][1]["value"];
                    var Operator = tok[i][2]["value"];
                    var SecondNumber = tok[i][3]["value"];
                    var code = tokb;
                }
                if (Operator === "EQUALS") {
                    if (FirstNumber == SecondNumber) {
                        const input = code;
                        const lexer = new Lexer(input);
                        const tokens = lexer.lex();
                        run(untokenize(input));
                    } else {
                        for (let ei = 0; ei < elseTok.length; ei++) {
                            if (elseTok[ei][0]["value"] === "RIGHT_BRACE") {
                                if (elseTok[ei][1] && elseTok[ei][1]["value"] === "ELSE") {
                                    let value = elseTok[ei]
                                    value = value.slice(3);
                                    run(untokenize(value));
                                    break;
                                }
                            }
                        }
                    }
                }
                if (Operator === "NOT_EQUALS") {
                    if (FirstNumber != SecondNumber) {
                        const input = code;
                        const lexer = new Lexer(input);
                        const tokens = lexer.lex();
                        run(untokenize(input));
                    } else {
                        for (let ei = 0; ei < elseTok.length; ei++) {
                            if (elseTok[ei][0]["value"] === "RIGHT_BRACE") {
                                if (elseTok[ei][1] && elseTok[ei][1]["value"] === "ELSE") {
                                    let value = elseTok[ei]
                                    value = value.slice(3);
                                    run(untokenize(value));
                                    break;
                                }
                            }
                        }
                    }
                }
                if (Operator === "REALLY_NOT_EQUALS") {
                    if (FirstNumber !== SecondNumber) {
                        const input = code;
                        const lexer = new Lexer(input);
                        const tokens = lexer.lex();
                        run(untokenize(input));
                    } else {
                        for (let ei = 0; ei < elseTok.length; ei++) {
                            if (elseTok[ei][0]["value"] === "RIGHT_BRACE") {
                                if (elseTok[ei][1] && elseTok[ei][1]["value"] === "ELSE") {
                                    let value = elseTok[ei]
                                    value = value.slice(3);
                                    run(untokenize(value));
                                    break;
                                }
                            }
                        }
                    }
                }
                if (Operator === "LESS_THAN") {
                    if (FirstNumber < SecondNumber) {
                        const input = code;
                        const lexer = new Lexer(input);
                        const tokens = lexer.lex();
                        run(untokenize(input));
                    } else {
                        for (let ei = 0; ei < elseTok.length; ei++) {
                            if (elseTok[ei][0]["value"] === "RIGHT_BRACE") {
                                if (elseTok[ei][1] && elseTok[ei][1] && elseTok[ei][1]["value"] === "ELSE") {
                                    let value = elseTok[ei]
                                    value = value.slice(3);
                                    run(untokenize(value));
                                    break;
                                }
                            }
                        }
                    }
                }
                if (Operator === "GREATER_THAN") {
                    if (FirstNumber > SecondNumber) {
                        const input = code;
                        const lexer = new Lexer(input);
                        const tokens = lexer.lex();
                        run(untokenize(input));
                    } else {
                        for (let ei = 0; ei < elseTok.length; ei++) {
                            if (elseTok[ei][0]["value"] === "RIGHT_BRACE") {
                                if (elseTok[ei][1] && elseTok[ei][1]["value"] === "ELSE") {
                                    let value = elseTok[ei]
                                    value = value.slice(3);
                                    run(untokenize(value));
                                    break;
                                }
                            }
                        }
                    }
                }
                if (Operator === "LESS_THAN_EQUALS") {
                    if (FirstNumber <= SecondNumber) {
                        const input = code;
                        const lexer = new Lexer(input);
                        const tokens = lexer.lex();
                        run(untokenize(input));
                    } else {
                        for (let ei = 0; ei < elseTok.length; ei++) {
                            if (elseTok[ei][0]["value"] === "RIGHT_BRACE") {
                                if (elseTok[ei][1] && elseTok[ei][1]["value"] === "ELSE") {
                                    let value = elseTok[ei]
                                    value = value.slice(3);
                                    run(untokenize(value));
                                    break;
                                }
                            }
                        }
                    }
                }
                if (Operator === "GREATER_THAN_EQUALS") {
                    if (FirstNumber >= SecondNumber) {
                        const input = code;
                        const lexer = new Lexer(input);
                        const tokens = lexer.lex();
                        run(untokenize(input));
                    } else {
                        for (let ei = 0; ei < elseTok.length; ei++) {
                            if (elseTok[ei][0]["value"] === "RIGHT_BRACE") {
                                if (elseTok[ei][1] && elseTok[ei][1]["value"] === "ELSE") {
                                    let value = elseTok[ei]
                                    value = value.slice(3);
                                    run(untokenize(value));
                                    break;
                                }
                            }
                        }
                    }
                }
                if (Operator === "REALLY_EQUALS") {
                    if (FirstNumber === SecondNumber) {
                        const input = code;
                        const lexer = new Lexer(input);
                        const tokens = lexer.lex();
                        run(untokenize(input));
                    } else {
                        for (let ei = 0; ei < elseTok.length; ei++) {
                            if (elseTok[ei][0]["value"] === "RIGHT_BRACE") {
                                if (elseTok[ei][1] && elseTok[ei][1]["value"] === "ELSE") {
                                    let value = elseTok[ei]
                                    value = value.slice(3);
                                    run(untokenize(value));
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        ifState();
        /*
        if (!cppExecuted) {
          cpp();
          cppExecuted = true;
        }
        function cpp() {
          exec(__dirname + '/index.exe', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            if (stdout) {
              console.log(`${stdout}`);
            }
            if (stderr) {
              console.error(`${stderr}`);
            }
          });
        }
        */
        fs.writeFile("./LuxScript/Transfer/lx.lxt", JSON.stringify(tok), function(err) {});
        if (file !== "MAIN") {
            const input = code;
            const lexer = new Lexer(input);
            const code2 = lexer.lex();
            fs.writeFile("./LuxScript/Transfer/main.lxt", JSON.stringify(code2), function(err) {});
        }
    }
}

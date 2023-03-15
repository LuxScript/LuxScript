let fs = require("fs");
const { exec } = require('child_process');
const chalk = require('chalk');
const http = require('http');
const natural = require("natural");

let untokenize = require("./functions");

let TokenType = require("./Lexer/tokentype");
let Token = require("./Lexer/token");
let KEYWORDS = require("./Lexer/keywords");
let OPERATORS = require("./Lexer/operators");
let PUNCTUATION = require("./Lexer/punctuation");
const { parseArgs } = require("util");
let simd = 0.7;
 
  class Lexer {
    constructor(input) {
      this.input = input;
      this.position = 0;
      this.tokens = [];
    }
  
    lex() {
      while (this.position < this.input.length) {
        const currentChar = this.input[this.position];
    
        if (/[a-zA-Z]/.test(currentChar)) {
          this.lexIdentifier();
        } else if (/\d/.test(currentChar)) {
          this.lexNumber();
        } else if (/[=+\-*/><!]/.test(currentChar)) {
          this.lexOperator();
        } else if (/[(\){}[\],;:.]/.test(currentChar)) {
          this.lexPunctuation();
        } else if (currentChar === '"') {
          this.lexDoubleQuotedString();
        } else if (currentChar === "'") {
          this.lexSingleQuotedString();
        } else if (currentChar === "`") {
          this.lexBacktickQuotedString();
        } else if (currentChar === "#") {
          this.lexComment();
        } else if (/\s/.test(currentChar)) {
          // Ignore whitespace
          this.position++;
        } else {
          throw new Error(`Invalid character: ${currentChar}`);
        }
      }
    
      return this.tokens;
    }
    
    lexDoubleQuotedString() {
      let str = "";
      this.position++;
    
      while (this.position < this.input.length && this.input[this.position] !== '"') {
        str += this.input[this.position];
        this.position++;
      }
    
      if (this.input[this.position] !== '"') {
        throw new Error(`Unterminated string: ${str}`);
      }
    
      this.position++; // skip over the ending quote
      this.tokens.push(new Token(TokenType.STRING, str));
    }
    
    lexSingleQuotedString() {
      let str = "";
      this.position++;
    
      while (this.position < this.input.length && this.input[this.position] !== "'") {
        str += this.input[this.position];
        this.position++;
      }
    
      if (this.input[this.position] !== "'") {
        throw new Error(`Unterminated string: ${str}`);
      }
    
      this.position++; // skip over the ending quote
      this.tokens.push(new Token(TokenType.STRING, str));
    }
    
    lexBacktickQuotedString() {
      let str = "";
      this.position++;
    
      while (this.position < this.input.length && this.input[this.position] !== "`") {
        str += this.input[this.position];
        this.position++;
      }
    
      if (this.input[this.position] !== "`") {
        throw new Error(`Unterminated string: ${str}`);
      }
    
      this.position++; // skip over the ending quote
      this.tokens.push(new Token(TokenType.STRINGVAR, str));
    }    
  
    lexIdentifier() {
      let identifier = "";
    
      while (/[a-zA-Z\d_]/.test(this.input[this.position])) {
        identifier += this.input[this.position];
        this.position++;
    
        // Split input into smaller chunks and call lexIdentifier recursively
        if (identifier.length > 1000) {
          const remaining = this.input.slice(this.position);
          const lexer = new Lexer(remaining);
          const tokens = lexer.lex();
          this.tokens.push(...tokens);
          return;
        }
      }
      
      if (KEYWORDS.hasOwnProperty(identifier)) {
        this.tokens.push(new Token(TokenType.KEYWORD, KEYWORDS[identifier]));
      } else if (identifier === "true") {
        this.tokens.push(new Token(TokenType.BOOLEAN, identifier));
      } else if (identifier === "false") {
        this.tokens.push(new Token(TokenType.BOOLEAN, identifier));
      } else {
        this.tokens.push(new Token(TokenType.IDENTIFIER, identifier));
      }      
    }  
  
    lexNumber() {
      let number = "";
  
      while (/\d/.test(this.input[this.position])) {
        number += this.input[this.position];
        this.position++;
      }
  
      if (this.input[this.position] === ".") {
        number += this.input[this.position];
        this.position++;
  
        while (/\d/.test(this.input[this.position])) {
          number += this.input[this.position];
          this.position++;
        }
      }
  
      this.tokens.push(new Token(TokenType.NUMBER, parseFloat(number)));
    }

    lexComment() {
      const start = this.position;
      this.position += 2; // skip over the first two characters
    
      if (this.input[this.position] === "#") {
        // Multi-line comment
        this.position++; // skip over the third character
        let depth = 1;
    
        while (depth > 0 && this.position < this.input.length) {
          const currentChar = this.input[this.position];
    
          if (currentChar === "#" && this.input[this.position + 1] === "*" && this.input[this.position + 2] === "*") {
            // Start of nested multi-line comment
            depth++;
            this.position += 3;
          } else if (currentChar === "*" && this.input[this.position + 1] === "*" && this.input[this.position + 2] === "#") {
            // End of nested multi-line comment
            depth--;
            this.position += 3;
          } else {
            this.position++;
          }
        }
    
        if (depth !== 0) {
          throw new Error(`Unterminated multi-line comment starting at position ${start}`);
        }
      } else {
        // Line comment
        while (this.position < this.input.length && this.input[this.position] !== "\n") {
          this.position++;
        }
      }
    
      const comment = this.input.slice(start, this.position);
      this.tokens.push(new Token(TokenType.COMMENT, comment));
    
      // Remove comment from tokens
      this.tokens = this.tokens.filter(token => token.type !== TokenType.COMMENT);
    }    
    
    lexString() {
      let str = "";
      this.position++;
    
      while (this.position < this.input.length && this.input[this.position] !== '"' && this.input[this.position] !== "'" && this.input[this.position] !== "`") {
        str += this.input[this.position];
        this.position++;
      }
    
      if (this.input[this.position] !== '"' && this.input[this.position] !== "'" && this.input[this.position] !== "`") {
        throw new Error(`Unterminated string: ${str}`);
      }
    
      this.position++; // skip over the ending quote
      this.tokens.push(new Token(TokenType.STRING, str));
    }

    lexStringVar() {
      let str = "";
      this.position++;
    
      while (this.position < this.input.length && this.input[this.position] !== '`') {
        str += this.input[this.position];
        this.position++;
      }
    
      if (this.input[this.position] !== '`') {
        throw new Error(`Unterminated string var: ${str}`);
      }
    
      this.position++; // skip over the ending backtick
      this.tokens.push(new Token(TokenType.STRINGVAR, str));
    }    
  
    lexOperator() {
      let operator = "";
  
      while (/[=+\-*/><!]/.test(this.input[this.position])) {
        operator += this.input[this.position];
        this.position++;
      }
  
      this.tokens.push(new Token(TokenType.OPERATOR, OPERATORS[operator]));
    }
  
    lexPunctuation() {
      const punctuation = this.input[this.position];
      this.tokens.push(new Token(TokenType.PUNCTUATION, PUNCTUATION[punctuation]));
      this.position++;
    }
}
fs.readFile("./LuxScript/Transfer/transfer.lxt", "utf8", function(err, file) {
  var file2 = file;
  if (file === "--run") {
    code = fs.readFileSync("./LuxScript/Transfer/gui.lxt", "utf8");
  }
  if (!file2.endsWith(".lx")) {
    var file2 = file + ".lx"
  }
  module.exports = file2;
  if (file.endsWith(".lx")) {
    file = file.slice(0, - 3)
  }
  let error = require("./errors");
  if (!fs.existsSync(file + ".lx")) {
    error[2]();
    return false;
  }
  if (file === "--gui") {
    return false;
  }
  fs.readFile(file + ".lx", "utf8", function(err, data) {
    function run(code) {
      const input = code;
      const lexer = new Lexer(input);
      const tokens = lexer.lex();
      
      let result = [];
      let temp = [];
      
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        if (token.type === TokenType.PUNCTUATION && token.value === "SEMICOLON") {
          result.push(temp);
          temp = [];
        } else {
          temp.push(token);
        }
      }
    
      if (temp.length > 0) {
        result.push(temp);
      }
    
      let tok = result;
    
      // Variables
      let variable = {};
      let variableName;
      let imports = {};
      let getI = {};
      
      // Syntax
      for (var i = 0; i < tok.length; i++) {

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
            }
          }
        }

        // .functions
        var i2;
        for (i2 = 0; i2 < tok[i].length; i2++) {
          if (tok[i][i2]["value"] === "DOT") {
            break;
          }
        }
        if (i2 < tok[i].length - 1) {
          var tad = tok[i].slice(i2 + 1);
          
          // Substring
          if (tad[0]["value"] === "substring") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              console.log(tad[0]["value"]);
              variable[tok[i][0]["value"]] = variable[tok[i][0]["value"]].substring(tad[2]["value"]);
            }
          }
          // Slice
          if (tad[0]["value"] === "slice") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              tok[i][3]["value"] = tok[i][3]["value"].slice(tad[2]["value"]);
            }
          }
          // lenght
          if (tad[0]["value"] === "lenght") {
            tok[i][3]["value"] = tok[i][3]["value"].length;
          }
          // Replace
          if (tad[0]["value"] === "replace") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              if (tad[3]["value"] === "COMMA") {
                tok[i][3]["value"] = tok[i][3]["value"].replace(tad[2]["value"], tad[4]["value"]);
              }
            }
          }
          // Replace all
          if (tad[0]["value"] === "replaceall") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              if (tad[3]["value"] === "COMMA") {
                tok[i][3]["value"] = tok[i][3]["value"].replaceAll(tad[2]["value"], tad[4]["value"]);
              }
            }
          }
          // Remove
          if (tad[0]["value"] === "remove") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              tok[i][3]["value"] = tok[i][3]["value"].replace(tad[2]["value"], "");
            }
          }
          // Remove all
          if (tad[0]["value"] === "removeall") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              tok[i][3]["value"] = tok[i][3]["value"].replaceAll(tad[2]["value"], "");
            }
          }
          // Starts with
          if (tad[0]["value"] === "startswith") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              tok[i][3]["value"] = tok[i][3]["value"].startsWith(tad[2]["value"]);
            }
          }
          // Local date string
          if (tad[0]["value"] === "tolocaledatestring") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              tok[i][3]["value"] = tok[i][3]["value"].toLocaleDateString();
            }
          }
        }
  
        // Set
        if (tok[i][0]["value"] === "set") {
          if (tok[i][1]["value"] !== "" && tok[i][1]["value"] !== " ") {
            if (tok[i][2]["value"] === "ASSIGN") {
              if (tok[i][3]["value"] !== "") {
                if (tok[i][1]["value"] === "true") {
                  error[10]();
                  return false;
                }
                if (tok[i][1]["value"] === "false") {
                  error[11]();
                  return false;
                }
                if (tok[i][1]["value"] === "DEF") {
                  error[12]();
                  return false;
                }
                if (tok[i][1]["value"] === "IF") {
                  error[13]();
                  return false;
                }
                if (tok[i][3]["type"] === "BOOLEAN") {
                  if (tok[i][3]["value"] === "true") {
                    variable[tok[i][1]["value"]] = true;
                  }
                  if (tok[i][3]["value"] === "false") {
                    variable[tok[i][1]["value"]] = false;
                  }
                }
                // Variables in variables
                // With paren
                if (tok[i][3]["value"] === "LEFT_PAREN") {
                  if (tok[i][4]["value"] === String(Object.keys(variable))) {
                    variable[tok[i][1]["value"]] = variable[tok[i][4]["value"]];
                  } else {
                    // Variables
                    // Date
                  variableName = tok[i][1]["value"];
                  variable[tok[i][1]["value"]] = {};
                  variable[tok[i][1]["value"]] = tok[i][4]["value"];
                  if (tok[i][5] && tok[i][5]["value"] === "DOT") {
                    if (tok[i][6]["value"] !== "") {
                      eval(`variable["${tok[i][1]["value"]}"] = variable['${tok[i][4]["value"]}'].${tok[i][6]["value"]}`);
                    }
                  } else {
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    variable[tok[i][1]["value"]] = tok[i][4]["value"];
                  }
                  if (tok[i][3]["value"] === "NEW") {
                    if (tok[i][4]["value"] === "date") {
                      if (tok[i][5]["value"] === "LEFT_PAREN") {
                        variableName = tok[i][1]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][1]["value"]] = new Date();
                      }
                    } else {
                      // No date
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      variable[tok[i][1]["value"]] = tok[i][4]["value"];
                    }
                  }
                    let result = "";
                    if (tok[i][4] && tok[i][4]["value"] === "PLUS") {
                      for (let j = 2; j < tok[i].length; j += 2) {
                        result += tok[i][j + 1]["value"];
                      }
                      variable[tok[i][1]["value"]] = result;
                    }
                  }
                  // Without paren
                } else if (tok[i][3]["value"] === String(Object.keys(variable))) {
                  variable[tok[i][1]["value"]] = variable[tok[i][3]["value"]];
                } else {
                  // Variables
                  // Date
                  variableName = tok[i][1]["value"];
                  variable[tok[i][1]["value"]] = {};
                  variable[tok[i][1]["value"]] = tok[i][3]["value"];
                  if (tok[i][4] && tok[i][4]["value"] === "DOT") {
                    if (tok[i][5]["value"] !== "") {
                      eval(`variable["${tok[i][1]["value"]}"] = variable['${tok[i][3]["value"]}'].${tok[i][5]["value"]}`);
                    }
                  } else {
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    variable[tok[i][1]["value"]] = tok[i][3]["value"];
                  }
                  if (tok[i][3]["value"] === "NEW") {
                    if (tok[i][4]["value"] === "date") {
                      if (tok[i][5]["value"] === "LEFT_PAREN") {
                        variableName = tok[i][1]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][1]["value"]] = new Date();
                      }
                    } else {
                      // No date
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      variable[tok[i][1]["value"]] = tok[i][3]["value"];
                    }
                  }
                  let result = "";
                  if (tok[i][4] && tok[i][4]["value"] === "PLUS") {
                    for (let j = 2; j < tok[i].length; j += 2) {
                      result += tok[i][j + 1]["value"];
                    }
                    variable[tok[i][1]["value"]] = result;
                  }
                }
                if (tok[i][3]["value"] === "LEFT_BRACE") {
                  let tok2 = tok[i].splice(3);
                  variableName = tok[i][1]["value"];
                  variable[tok[i][1]["value"]] = {};
                  variable[tok[i][1]["value"]] = JSON.parse(untokenize(tok2));
                } else if (tok[i][3]["value"] === "LEFT_BAR") {
                  
                  if (tok[i][5]["value"] === "COLON") {
                    let tok2 = tok[i].splice(4).slice(0, - 1);
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    const jsonString = `{${untokenize(tok2)}}`;
                    variable[tok[i][1]["value"]] = JSON.parse(jsonString);
                  } else {
                    let tok2 = tok[i].splice(3);
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    variable[tok[i][1]["value"]] = JSON.parse(untokenize(tok2));
                  }
                }
              }
            } else if (tok[i][2]["value"] === "COLON") {
              if (tok[i][3]["value"] === "string") {
                if (tok[i][3 + 2]["value"] !== "") {
                  if (tok[i][5]["type"] === "NUMBER") {
                    error[19]();
                    return false;
                  }
                  if (tok[i][1]["value"] === "true") {
                    error[10]();
                    return false;
                  }
                  if (tok[i][1]["value"] === "false") {
                    error[11]();
                    return false;
                  }
                  if (tok[i][1]["value"] === "DEF") {
                    error[12]();
                    return false;
                  }
                  if (tok[i][1]["value"] === "IF") {
                    error[13]();
                    return false;
                  }
                  if (tok[i][3 + 2]["type"] === "BOOLEAN") {
                    if (tok[i][3 + 2]["value"] === "true") {
                      variable[tok[i][1]["value"]] = true;
                    }
                    if (tok[i][3 + 2]["value"] === "false") {
                      variable[tok[i][1]["value"]] = false;
                    }
                  }
                  // Variables in variables
                  // With paren
                  if (tok[i][3 + 2]["value"] === "LEFT_PAREN") {
                    if (tok[i][4 + 2]["value"] === String(Object.keys(variable))) {
                      variable[tok[i][1]["value"]] = variable[tok[i][4 + 2]["value"]];
                    } else {
                      // Variables
                      // Date
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    variable[tok[i][1]["value"]] = tok[i][4 + 2]["value"];
                    if (tok[i][5 + 2] && tok[i][5 + 2]["value"] === "DOT") {
                      if (tok[i][6 + 2]["value"] !== "") {
                        eval(`variable["${tok[i][1]["value"]}"] = variable['${tok[i][4 + 2]["value"]}'].${tok[i][6 + 2]["value"]}`);
                      }
                    } else {
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      variable[tok[i][1]["value"]] = tok[i][4 + 2]["value"];
                    }
                    if (tok[i][3 + 2]["value"] === "NEW") {
                      if (tok[i][4 + 2]["value"] === "date") {
                        if (tok[i][5 + 2]["value"] === "LEFT_PAREN") {
                          variableName = tok[i][1]["value"];
                          variable[tok[i][1]["value"]] = {};
                          variable[tok[i][1]["value"]] = new Date();
                        }
                      } else {
                        // No date
                        variableName = tok[i][1]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][1]["value"]] = tok[i][4 + 2]["value"];
                      }
                    }
                      let result = "";
                      if (tok[i][4 + 2] && tok[i][4 + 2]["value"] === "PLUS") {
                        for (let j = 2; j < tok[i].length; j += 2) {
                          result += tok[i][j + 1]["value"];
                        }
                        variable[tok[i][1]["value"]] = result;
                      }
                    }
                    // Without paren
                  } else if (tok[i][3 + 2]["value"] === String(Object.keys(variable))) {
                    variable[tok[i][1]["value"]] = variable[tok[i][3 + 2]["value"]];
                  } else {
                    // Variables
                    // Date
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    variable[tok[i][1]["value"]] = tok[i][3 + 2]["value"];
                    if (tok[i][4 + 2] && tok[i][4 + 2]["value"] === "DOT") {
                      if (tok[i][5 + 2]["value"] !== "") {
                        eval(`variable["${tok[i][1]["value"]}"] = variable['${tok[i][3 + 2]["value"]}'].${tok[i][5 + 2]["value"]}`);
                      }
                    } else {
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      variable[tok[i][1]["value"]] = tok[i][3 + 2]["value"];
                    }
                    if (tok[i][3 + 2]["value"] === "NEW") {
                      if (tok[i][4 + 2]["value"] === "date") {
                        if (tok[i][5 + 2]["value"] === "LEFT_PAREN") {
                          variableName = tok[i][1]["value"];
                          variable[tok[i][1]["value"]] = {};
                          variable[tok[i][1]["value"]] = new Date();
                        }
                      } else {
                        // No date
                        variableName = tok[i][1]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][1]["value"]] = tok[i][3 + 2]["value"];
                      }
                    }
                    let result = "";
                    if (tok[i][4 + 2] && tok[i][4 + 2]["value"] === "PLUS") {
                      for (let j = 2; j < tok[i].length; j += 2) {
                        result += tok[i][j + 1]["value"];
                      }
                      variable[tok[i][1]["value"]] = result;
                    }
                  }
                  if (tok[i][3 + 2]["value"] === "LEFT_BRACE") {
                    let tok2 = tok[i].splice(3);
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    variable[tok[i][1]["value"]] = JSON.parse(untokenize(tok2));
                  } else if (tok[i][3 + 2]["value"] === "LEFT_BAR") {
                    
                    if (tok[i][5 + 2]["value"] === "COLON") {
                      let tok2 = tok[i].splice(4).slice(0, - 1);
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      const jsonString = `{${untokenize(tok2)}}`;
                      variable[tok[i][1]["value"]] = JSON.parse(jsonString);
                    } else {
                      let tok2 = tok[i].splice(3);
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      variable[tok[i][1]["value"]] = JSON.parse(untokenize(tok2));
                    }
                  }
                }
              } else if (tok[i][3]["value"] === "int") {
                if (tok[i][3 + 2]["value"] !== "") {
                  if (tok[i][5]["type"] === "STRING") {
                    error[20]();
                    return false;
                  }
                  if (tok[i][1]["value"] === "true") {
                    error[10]();
                    return false;
                  }
                  if (tok[i][1]["value"] === "false") {
                    error[11]();
                    return false;
                  }
                  if (tok[i][1]["value"] === "DEF") {
                    error[12]();
                    return false;
                  }
                  if (tok[i][1]["value"] === "IF") {
                    error[13]();
                    return false;
                  }
                  if (tok[i][3 + 2]["type"] === "BOOLEAN") {
                    if (tok[i][3 + 2]["value"] === "true") {
                      variable[tok[i][1]["value"]] = true;
                    }
                    if (tok[i][3 + 2]["value"] === "false") {
                      variable[tok[i][1]["value"]] = false;
                    }
                  }
                  // Variables in variables
                  // With paren
                  if (tok[i][3 + 2]["value"] === "LEFT_PAREN") {
                    if (tok[i][4 + 2]["value"] === String(Object.keys(variable))) {
                      variable[tok[i][1]["value"]] = variable[tok[i][4 + 2]["value"]];
                    } else {
                      // Variables
                      // Date
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    variable[tok[i][1]["value"]] = tok[i][4 + 2]["value"];
                    if (tok[i][5 + 2] && tok[i][5 + 2]["value"] === "DOT") {
                      if (tok[i][6 + 2]["value"] !== "") {
                        eval(`variable["${tok[i][1]["value"]}"] = variable['${tok[i][4 + 2]["value"]}'].${tok[i][6 + 2]["value"]}`);
                      }
                    } else {
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      variable[tok[i][1]["value"]] = tok[i][4 + 2]["value"];
                    }
                    if (tok[i][3 + 2]["value"] === "NEW") {
                      if (tok[i][4 + 2]["value"] === "date") {
                        if (tok[i][5 + 2]["value"] === "LEFT_PAREN") {
                          variableName = tok[i][1]["value"];
                          variable[tok[i][1]["value"]] = {};
                          variable[tok[i][1]["value"]] = new Date();
                        }
                      } else {
                        // No date
                        variableName = tok[i][1]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][1]["value"]] = tok[i][4 + 2]["value"];
                      }
                    }
                      let result = "";
                      if (tok[i][4 + 2] && tok[i][4 + 2]["value"] === "PLUS") {
                        for (let j = 2; j < tok[i].length; j += 2) {
                          result += tok[i][j + 1]["value"];
                        }
                        variable[tok[i][1]["value"]] = result;
                      }
                    }
                    // Without paren
                  } else if (tok[i][3 + 2]["value"] === String(Object.keys(variable))) {
                    variable[tok[i][1]["value"]] = variable[tok[i][3 + 2]["value"]];
                  } else {
                    // Variables
                    // Date
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    variable[tok[i][1]["value"]] = tok[i][3 + 2]["value"];
                    if (tok[i][4 + 2] && tok[i][4 + 2]["value"] === "DOT") {
                      if (tok[i][5 + 2]["value"] !== "") {
                        eval(`variable["${tok[i][1]["value"]}"] = variable['${tok[i][3 + 2]["value"]}'].${tok[i][5 + 2]["value"]}`);
                      }
                    } else {
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      variable[tok[i][1]["value"]] = tok[i][3 + 2]["value"];
                    }
                    if (tok[i][3 + 2]["value"] === "NEW") {
                      if (tok[i][4 + 2]["value"] === "date") {
                        if (tok[i][5 + 2]["value"] === "LEFT_PAREN") {
                          variableName = tok[i][1]["value"];
                          variable[tok[i][1]["value"]] = {};
                          variable[tok[i][1]["value"]] = new Date();
                        }
                      } else {
                        // No date
                        variableName = tok[i][1]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][1]["value"]] = tok[i][3 + 2]["value"];
                      }
                    }
                    let result = "";
                    if (tok[i][4 + 2] && tok[i][4 + 2]["value"] === "PLUS") {
                      for (let j = 2; j < tok[i].length; j += 2) {
                        result += tok[i][j + 1]["value"];
                      }
                      variable[tok[i][1]["value"]] = result;
                    }
                  }
                  if (tok[i][3 + 2]["value"] === "LEFT_BRACE") {
                    let tok2 = tok[i].splice(3);
                    variableName = tok[i][1]["value"];
                    variable[tok[i][1]["value"]] = {};
                    variable[tok[i][1]["value"]] = JSON.parse(untokenize(tok2));
                  } else if (tok[i][3 + 2]["value"] === "LEFT_BAR") {
                    
                    if (tok[i][5 + 2]["value"] === "COLON") {
                      let tok2 = tok[i].splice(4).slice(0, - 1);
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      const jsonString = `{${untokenize(tok2)}}`;
                      variable[tok[i][1]["value"]] = JSON.parse(jsonString);
                    } else {
                      let tok2 = tok[i].splice(3);
                      variableName = tok[i][1]["value"];
                      variable[tok[i][1]["value"]] = {};
                      variable[tok[i][1]["value"]] = JSON.parse(untokenize(tok2));
                    }
                  }
                }
              }
            }
          }
        }

        // Base variables
        variable["dirpath"] = __dirname;
        variable["infinity"] = Infinity;
        variable["ninfinity"] = -Infinity;
        variable["undefined"] = undefined;
        variable["nan"] = NaN;
        variable["null"] = null;

        // Change value of variable with variable name
        if (tok[i][0]["value"] === variableName) {
          if (tok[i][1]["value"] === "REALLY_EQUALS") {
            console.log(variable[tok[i][0]["value"]] === tok[i][2]["value"])
          }
          if (tok[i][1]["value"] === "REALLY_NOT_EQUALS") {
            console.log(variable[tok[i][0]["value"]] !== tok[i][2]["value"])
          }
          if (tok[i][1]["value"] === "EQUALS") {
            console.log(variable[tok[i][0]["value"]] == tok[i][2]["value"])
          }
          if (tok[i][1]["value"] === "NOT_EQUALS") {
            console.log(variable[tok[i][0]["value"]] != tok[i][2]["value"])
          }
          if (tok[i][1]["value"] === "LESS_THAN") {
            console.log(variable[tok[i][0]["value"]] < tok[i][2]["value"])
          }
          if (tok[i][1]["value"] === "LESS_THAN_EQUALS") {
            console.log(variable[tok[i][0]["value"]] <= tok[i][2]["value"])
          }
          if (tok[i][1]["value"] === "GREATER_THAN") {
            console.log(variable[tok[i][0]["value"]] > tok[i][2]["value"])
          }
          if (tok[i][1]["value"] === "GREATER_THAN_EQUALS") {
            console.log(variable[tok[i][0]["value"]] >= tok[i][2]["value"])
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
          } else {
            if (tok[i][1]["value"] === "PLUS_ASSIGN") {
              variable[variableName] += tok[i][2]["value"];
            } else if (tok[i][1]["value"] === "MINUS_ASSIGN") {
              variable[variableName] -= tok[i][2]["value"];
            } else {
              variable[variableName] = tok[i][2]["value"];
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
          // Plus
          let result = "";
          if (tok[i][3]["value"] === "PLUS") {
            for (let j = 2; j < tok[i].length; j += 2) {
              result += tok[i][j]["value"];
            }
            console.log(result);
          } else {
            if (tok[i][3]["value"] === "PLUS") {
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
                    if (tok[i][6]["value"] !== "LEFT_PAREN") {
                      if (tok[i][4]["type"] === "IDENTIFIER") {
                        console.log(chalk.keyword(tok[i][6]["value"])(variable[tok[i][4]["value"]]));
                      }
                      if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][2]["type"] === "NUMBER") {
                        console.log(chalk.keyword(tok[i][6]["value"])(tok[i][4]["value"]));
                      }
                    } else if (tok[i][6]["value"] === "LEFT_PAREN") {
                      if (tok[i][4]["type"] === "IDENTIFIER") {
                        console.log(chalk.keyword(tok[i][7]["value"])(variable[tok[i][4]["value"]]));
                      }
                      if (tok[i][4]["type"] === "STRING" || tok[i][4]["type"] === "STRINGVAR" || tok[i][2]["type"] === "NUMBER") {
                        console.log(chalk.keyword(tok[i][7]["value"])(tok[i][4]["value"]));
                      }
                    }
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
        if (getI["json"] && getI["json"]["json"] === true) {
          if (getI["json"]["jsonAs"] !== "") {
            if (tok[i][0]["value"] === getI["json"]["jsonAs"]) {
              if (tok[i][1]["value"] === "DOT") {
                if (tok[i][2]["value"] === "parse") {
                  if (tok[i][3]["value"] === "LEFT_PAREN") {
                    if (tok[i][5]["value"] === "RIGHT_PAREN") {
                      if (tok[i][4]["type"] === "IDENTIFIER") {
                        tok[i][4]["value"] = variable[tok[i][4]["value"]];
                      }
                      JSON.parse(tok[i][4]["value"]);
                    }
                  }
                }
                if (tok[i][2]["value"] === "stringify") {
                  if (tok[i][3]["value"] === "LEFT_PAREN") {
                    if (tok[i][5]["value"] === "RIGHT_PAREN") {
                      JSON.stringify(tok[i][4]["value"]);
                    }
                  }
                }
              }
            }
          }
        }

        // Webserver
        if (getI["http"] && getI["http"]["http"] === true) {
          if (getI["http"]["httpAs"] !== "") {
            if (tok[i][0]["value"] === getI["http"]["httpAs"]) {
              if (tok[i][1]["value"] === "DOT") {
                if (tok[i][2]["value"] === "createserver") {
                  if (tok[i][3]["value"] === "LEFT_PAREN") {
                    if (tok[i][4]["type"] === "STRING") {
                      var html = tok[i][4]["value"]
                    }
                    if (tok[i][4]["type"] === "IDENTIFIER") {
                      var html = variable[tok[i][4]["value"]];
                    }
                    if (tok[i][6]["type"] === "NUMBER") {
                      var port = tok[i][6]["value"];
                    }
                    if (tok[i][6]["type"] === "IDENTIFIER") {
                      var port = variable[tok[i][6]["value"]];
                    }
                    const server = http.createServer((request, response) => {
                      response.writeHead(200, {'Content-Type': 'text/html'});
                      response.write(html);
                      response.end();
                    });
                    if (tok[i][5]["value"] === "COMMA") {
                      if (tok[i][6]) {
                        server.listen(port, () => {
                        });
                      } else {
                        console.log("Error: No port specified");
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // Circle
        if (getI["circle"] && getI["circle"]["circle"] === true) {
          if (getI["circle"]["circleAs"] !== "") {
            if (tok[i][0]["value"] === getI["circle"]["circleAs"]) {
              if (tok[i][1]["value"] == "DOT") {
                if (tok[i][2]["value"] === "findr") {
                  if (tok[i][3]["value"] === "LEFT_PAREN") {
                    if (tok[i][4]["type"] === "IDENTIFIER") {
                      var value = variable[tok[i][4]["value"]];
                    } else {
                      var value = tok[i][4]["value"];
                    }
                    let r = value;
                    let d = 2 * r;
                    let c = 2 * Math.PI * r;
                    let a = Math.PI * r * r;
                    let total = {
                      "radius": r,
                      "diameter": d,
                      "circumference": c,
                      "air": a
                    };
                    if (tok[i][6]["value"] === "DEF") {
                      if (tok[i][7]["value"] === "LEFT_PAREN") {
                        if (tok[i][8]["type"] === "STRING") {
                          error[23]();
                          return false;
                        }
                        variableName = tok[i][8]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][8]["value"]] = total;
                      }
                    } else {
                      error[5]();
                      return false;
                    }
                  }
                }
                if (tok[i][2]["value"] === "findd") {
                  if (tok[i][3]["value"] === "LEFT_PAREN") {
                    if (tok[i][4]["type"] === "IDENTIFIER") {
                      var value = variable[tok[i][4]["value"]];
                    } else {
                      var value = tok[i][4]["value"];
                    }
                    let d = value;
                    let r = d / 2;
                    let c = 2 * Math.PI * r;
                    let a = Math.PI * r * r;
                    let total = {
                      "radius": r,
                      "diameter": d,
                      "circumference": c,
                      "air": a
                    };
                    if (tok[i][6]["value"] === "DEF") {
                      if (tok[i][7]["value"] === "LEFT_PAREN") {
                        if (tok[i][8]["type"] === "STRING") {
                          error[23]();
                          return false;
                        }
                        variableName = tok[i][8]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][8]["value"]] = total;
                      }
                    }
                  }
                }
                if (tok[i][2]["value"] === "findc") {
                  if (tok[i][3]["value"] === "LEFT_PAREN") {
                    if (tok[i][4]["type"] === "IDENTIFIER") {
                      var value = variable[tok[i][4]["value"]];
                    } else {
                      var value = tok[i][4]["value"];
                    }
                    let c = value;
                    let r = c / (2 * Math.PI)
                    let d = r * 2;
                    let a = Math.PI * r * r;
                    let total = {
                      "radius": r,
                      "diameter": d,
                      "circumference": c,
                      "air": a
                    };
                    if (tok[i][6]["value"] === "DEF") {
                      if (tok[i][7]["value"] === "LEFT_PAREN") {
                        if (tok[i][8]["type"] === "STRING") {
                          error[23]();
                          return false;
                        }
                        variableName = tok[i][8]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][8]["value"]] = total;
                      }
                    }
                  }
                }
                if (tok[i][2]["value"] === "finda") {
                  if (tok[i][3]["value"] === "LEFT_PAREN") {
                    if (tok[i][4]["type"] === "IDENTIFIER") {
                      var value = variable[tok[i][4]["value"]];
                    } else {
                      var value = tok[i][4]["value"];
                    }
                    let a = value;
                    let r = Math.sqrt(a / Math.PI);
                    let d = r * 2;
                    let c = 2 * Math.PI * r;
                    let total = {
                      "radius": r,
                      "diameter": d,
                      "circumference": c,
                      "air": a
                    };
                    if (tok[i][6]["value"] === "DEF") {
                      if (tok[i][7]["value"] === "LEFT_PAREN") {
                        if (tok[i][8]["type"] === "STRING") {
                          error[23]();
                          return false;
                        }
                        variableName = tok[i][8]["value"];
                        variable[tok[i][1]["value"]] = {};
                        variable[tok[i][8]["value"]] = total;
                      }
                    }
                  }
                }
              }
            }
          }
        }

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
        if (tok[i][0]["value"] === "SWITCH") {
          if (tok[i][1]["value"] === "LEFT_PAREN") {
            switch (variable[tok[i][2]["value"]]) {
              case tok[i][6]["value"]:
                const leftBraceIndex = tok[i].findIndex((token) => token["value"] === "LEFT_BRACE");
                const leftParenIndex = tok[i].findIndex((token, index) => index > leftBraceIndex && token["value"] === "LEFT_PAREN");
                const remainingTokens = tok[i].slice(leftParenIndex - 1);
                tok[i] = remainingTokens;
                run(untokenize(tok[i]));
            }
          }
        }

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
        if (tok[i][0]["value"] === "calc") {
          if (tok[i][1]["value"] === "LEFT_PAREN") {
            let result = tok[i];
            result.shift();
            result.shift();
            result.pop();
            for (let id = 0; id < result.length; id++) {
              if (result[id]["type"] === "STRING") {
                error[22]();
                return false;
              }
            }            
            console.log(eval(untokenize(result)));
          }
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

        // Functions
        var functions = {};
        function func() {
          if (tok[i][0]["value"] === "DEF") {
            if (tok[i][1]["value"] !== "") {
              if (tok[i][2]["value"] === "LEFT_PAREN") {
                if (tok[i][3]["value"] === "RIGHT_PAREN") {
                  // Add a new property to the functions object
                  functions[tok[i][1]["value"]] = function() {
                    tok[i].shift();
                    tok[i].shift();
                    tok[i].shift();
                    tok[i].shift();
                    tok[i].shift();
                    run(untokenize(tok[i]))
                  };
                }
              }
            }
          }
        }
        func();
        function exeFunc() {
          var functionNames = Object.keys(functions);
          for (var y = 0; y < functionNames.length; y++) {
            for (var o = 0; o < tok[i].length; o++) {
              if (tok[i][0]["value"] === functionNames[y]) {
                if (functions[functionNames[y]]) {
                  functions[functionNames[y]]();
                }
              }
            }
          }
        }
        exeFunc();

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
                        /*
                        variableName = tok[i][4]["value"];
                        variable[tok[i][4]["value"]] = {};
                        variable[tok[i][4]["value"]] = i;
                        */
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
      }
    }
    run(data);
  });
});
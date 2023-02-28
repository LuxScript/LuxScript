let fs = require("fs");

let untokenize = require("./functions");

let TokenType = require("./Lexer/tokentype");
let Token = require("./Lexer/token");
let KEYWORDS = require("./Lexer/keywords");
let OPERATORS = require("./Lexer/operators");
let PUNCTUATION = require("./Lexer/punctuation");
let error = require("./errors");
  
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
      } else if (/[(\){},;.]/.test(currentChar)) {
        this.lexPunctuation();
      } else if (currentChar === '"') {
        this.lexString();
      } else if (/\s/.test(currentChar)) {
        // Ignore whitespace
        this.position++;
      } else {
        throw new Error(`Invalid character: ${currentChar}`);
      }
    }

    return this.tokens;
  }
  
    lexIdentifier() {
      let identifier = "";
  
      while (/[a-zA-Z\d_]/.test(this.input[this.position])) {
        identifier += this.input[this.position];
        this.position++;
      }
  
      if (KEYWORDS.hasOwnProperty(identifier)) {
        this.tokens.push(new Token(TokenType.KEYWORD, KEYWORDS[identifier]));
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
    lexString() {
      let str = "";
      this.position++; // skip over the starting quote
    
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
  if (file.endsWith(".lx")) {
    file = file.slice(0, - 3)
  }
  if (!fs.existsSync(file + ".lx")) {
    error[2]();
    return false;
  }
  fs.readFile(file + ".lx", "utf8", function(err, data) {
    run(data);
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
    
      // Syntax
    
      for (var i = 0; i < tok.length; i++) {
        // Imports
        if (tok[i][0]["value"] === "import") {
          tf.exportVariable(tok[i][1]["value"], "Import Token")
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
              tok[i][3]["value"] = tok[i][3]["value"].substring(tad[2]["value"]);
            } else {
              error[4]();
              return false;
            }
          }
          // Slice
          if (tad[0]["value"] === "slice") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              tok[i][3]["value"] = tok[i][3]["value"].slice(tad[2]["value"]);
            } else {
              error[4]();
              return false;
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
            } else {
              error[4]();
              return false;
            }
          }
          // Replace all
          if (tad[0]["value"] === "replaceall") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              if (tad[3]["value"] === "COMMA") {
                tok[i][3]["value"] = tok[i][3]["value"].replaceAll(tad[2]["value"], tad[4]["value"]);
              }
            } else {
              error[4]();
              return false;
            }
          }
          // Remove
          if (tad[0]["value"] === "remove") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              tok[i][3]["value"] = tok[i][3]["value"].replace(tad[2]["value"], "");
            } else {
              error[4]();
              return false;
            }
          }
          // Remove all
          if (tad[0]["value"] === "removeall") {
            if (tad[1]["value"] === "LEFT_PAREN") {
              tok[i][3]["value"] = tok[i][3]["value"].replaceAll(tad[2]["value"], "");
            } else {
              error[4]();
              return false;
            }
          }
        }
  
        // Let
        if (tok[i][0]["value"] === "let") {
          if (tok[i][1]["value"] !== "" && tok[i][1]["value"] !== " ") {
            if (tok[i][2]["value"] === "ASSIGN") {
              if (tok[i][3]["value"] !== "") {
                // Variables in variables
                if (tok[i][3]["value"] === String(Object.keys(variable))) {
                  variable[tok[i][1]["value"]] = variable[tok[i][3]["value"]];
                } else {
                  // Variables
                  variableName = tok[i][1]["value"];
                  variable[tok[i][1]["value"]] = {};
                  variable[tok[i][1]["value"]] = tok[i][3]["value"];
                }
              }
            }
          }
        }

        // Change value of variable with variable name
        if (tok[i][0]["value"] === variableName) {
          variable[variableName] = tok[i][2]["value"];
        }
        
        // Print
        if (tok[i][0]["value"] === "print") {
          if (tok[i][1]["value"] === "LEFT_PAREN") {
            if (tok[i][3]["value"] === "RIGHT_PAREN") {
              if (tok[i][2]["type"] === "IDENTIFIER") {
                console.log(variable[tok[i][2]["value"]])
              }
              if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                console.log(tok[i][2]["value"]);
              }
            } else {
              error[4]();
              return false;
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
          } else {
            error[4]();
            return false;
          }
          if (tok[i][1]["value"] === "DOT") {
            if (tok[i][2]["value"] === "error") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.error(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.error(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "warn") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.warn(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.warn(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "assert") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.assert(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.assert(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "count") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    console.count(tok[i][4]["value"]);
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "countreset") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.countReset(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.countReset(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "debug") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.debug(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.debug(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "dir") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.dir(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.dir(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "dirxml") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.dirxml(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.dirxml(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "group") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.group(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.group(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "info") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.info(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.info(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "groupcollapsed") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.groupCollapsed(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.groupCollapsed(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "profile") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.profile(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.profile(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "profileend") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.profileEnd(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.profileEnd(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "table") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.table(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.table(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "time") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.time(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.time(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "timeend") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.timeEnd(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.timeEnd(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "timelog") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.timeLog(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.timeLog(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "timestamp") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.timeStamp(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.timeStamp(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "trace") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4] !== "") {
                  if (tok[i][5]["value"] === "RIGHT_PAREN") {
                    if (tok[i][2]["type"] === "IDENTIFIER") {
                      console.trace(variable[tok[i][2]["value"]])
                    }
                    if (tok[i][2]["type"] === "STRING" || tok[i][2]["type"] === "NUMBER") {
                      console.trace(tok[i][2]["value"]);
                    }
                  } else {
                    error[4]();
                    return false;
                  }
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "clear") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][4]["value"] === "RIGHT_PAREN") {
                  console.clear();
                } else {
                  error[3]();
                  return false;
                }
              } else {
                error[4]();
                return false;
              }
            }
          }
        }

        // Json
        if (tok[i][0]["value"] === "json") {
          if (tok[i][1]["value"] === "DOT") {
            if (tok[i][2]["value"] === "parse") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][5]["value"] === "RIGHT_PAREN") {
                  JSON.parse(tok[i][4]["value"]);
                } else {
                  error[4]();
                  return false;
                }
              } else {
                error[4]();
                return false;
              }
            }
            if (tok[i][2]["value"] === "stringify") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                if (tok[i][5]["value"] === "RIGHT_PAREN") {
                  JSON.stringify(tok[i][4]["value"]);
                } else {
                  error[4]();
                  return false;
                }
              } else {
                error[4]();
                return false;
              }
            }
          }
        }
  
        // Maths
        if (String(tok[i][0]["value"]).match(/[1-9]/)) {
          // Plus
          if (tok[i][1]["value"] === "PLUS") {
            if (String(tok[i][2]["value"]).match(/[1-9]/)) {
              console.log(tok[i][0]["value"] + tok[i][2]["value"]);
            }
          }
          // Minus
          if (tok[i][1]["value"] === "MINUS") {
            if (String(tok[i][2]["value"]).match(/[1-9]/)) {
              console.log(tok[i][0]["value"] - tok[i][2]["value"]);
            }
          }
          // Multiply
          if (tok[i][1]["value"] === "MULTIPLY") {
            if (String(tok[i][2]["value"]).match(/[1-9]/)) {
              console.log(tok[i][0]["value"] * tok[i][2]["value"]);
            }
          }
          // Divide
          if (tok[i][1]["value"] === "DIVIDE") {
            if (String(tok[i][2]["value"]).match(/[1-9]/)) {
              console.log(tok[i][0]["value"] / tok[i][2]["value"]);
            }
          }
        }      
        if (tok[i][0]["value"] === "math") {
          if (tok[i][1]["value"] === "DOT") {
            if (tok[i][2]["value"] === "abs") {
              if (tok[i][3]["value"] === "LEFT_PAREN") {
                let result = Math.abs(tok[i][4]["value"]);
                // Replace the math.abs() call with the result.
                result = parseFloat(result); // Convert the result to a float (if it's not already)
                // Use the result variable instead of the math.abs() call
                // ...
                console.log(result)
              } else {
                error[4]();
                return false;
              }
            }
          }
        }

        // If statement
        if (tok[i][0]["value"] === "IF") {
          let newTokens = tok[i].slice(tok[i].indexOf(tok[i][6]));
          let tokb = newTokens.slice(1).slice(0, - 1);
          ifState(tok[i][2]["value"], tok[i][3]["value"], tok[i][4]["value"], tokb);
        }
      }
    }
    function ifState(FirstNumber, Operator, SecondNumber, code) {
      if (Operator === "EQUALS") {
        if (FirstNumber === SecondNumber) {
          run(untokenize(code));
        }
      }
    }
  });
});
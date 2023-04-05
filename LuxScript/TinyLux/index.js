function lexer(input) {
    const tokens = [];
    let currentToken = null;
    let insideString = false;
    let currentString = "";
  
    for (let i = 0; i < input.length; i++) {
      const char = input.charAt(i);
      const lookahead = input.charAt(i + 1);
  
      if (insideString) {
        if (char === '"' && lookahead !== '"') {
          currentString += char;
          continue;
        } else if (char === '"' && lookahead === '"') {
          currentString += char;
          i++;
          continue;
        } else if (char === '"' && lookahead === ";") {
          currentString += char;
          currentToken = { type: "STRING", value: currentString };
          tokens.push(currentToken);
          currentToken = null;
          currentString = "";
          insideString = false;
          i++;
          continue;
        } else {
          currentString += char;
          continue;
        }
      }
  
      if (char.match(/[a-z]/i) && lookahead.match(/[a-z]/i)) {
        currentToken = currentToken || { type: "KEYWORD", value: "" };
        currentToken.value += char;
      } else if (char.match(/[a-z]/i)) {
        currentToken = { type: "KEYWORD", value: char };
        tokens.push(currentToken);
        currentToken = null;
      } else if (char.match(/[0-9]/i) && lookahead.match(/[0-9]/i)) {
        currentToken = currentToken || { type: "NUMBER", value: "" };
        currentToken.value += char;
      } else if (char.match(/[0-9]/i)) {
        currentToken = { type: "NUMBER", value: char };
        tokens.push(currentToken);
        currentToken = null;
      } else if (char === "(" || char === ")" || char === "{" || char === "}") {
        currentToken = { type: "SYMBOL", value: char };
        tokens.push(currentToken);
        currentToken = null;
      } else if (char === ";") {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = null;
        }
        tokens.push([{ type: "SYMBOL", value: ";" }]);
      } else if (char === '"' && lookahead !== '"') {
        insideString = true;
        currentString = char;
      } else if (char === '"' && lookahead === '"') {
        insideString = true;
        currentString = char;
        i++;
      }
    }
  
    if (currentToken) {
      tokens.push(currentToken);
    }
  
    return tokens;
  }
  
  console.log(lexer('if ([0][1]["value"] = "test") { console.log("test"); } if ([1] == "test2") { var x = 5; }'));  
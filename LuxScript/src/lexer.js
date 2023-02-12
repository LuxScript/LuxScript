var fs = require('fs');
function tokenize(expression) {
  let lines = expression.split("\n" && ";");
  let tokens = [];
  for (var line of lines) {
    let current_token = "";
    let line_tokens = [];
    for (var char of line) {
      if (char === "(" || char === ")") {
        if (current_token) {
          line_tokens.push(current_token);
          current_token = "";
        }
      } else {
        current_token += char;
      }
    }
    if (current_token) {
      line_tokens.push(current_token);
    }
    if (line_tokens.length) {
      tokens.push(line_tokens);
    }
  }
  var variables = {};
  tokens.forEach(function(tokens) {
    if (tokens[0].startsWith('var')) {
      var variableSetted = tokens[0].substring(tokens[0].indexOf('var ') + 4, tokens[0].indexOf('=')).replaceAll(' ', '');
      variables[variableSetted] = tokens[1];
    }
    if (tokens[0].startsWith(variables[variableSetted])) {
      console.log(variables[variableSetted]);
    }
  });
  return tokens;
}

var dir = __dirname.replace('\\LuxScript\\src', '')
fs.readdir('./Scripts', 'utf8', function(err, files) {
  files.forEach(function(file) {
    fs.readFile('./Scripts/' + file, 'utf8', function(err, data) {
      console.log(tokenize(data));
    });
  });
});
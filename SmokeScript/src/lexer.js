const moo = require('moo')

let lexer = moo.compile({
  WS:      /[ \t]+/,
  comment: /\/\/.*?$/,
  number:  /0|[1-9][0-9]*/,
  string:  /"(?:\\["\\]|[^\n"\\])*"/,
  lparen:  '(',
  rparen:  ')',
  keyword: ['while', 'if', 'else', 'moo', 'cows'],
  identifier: /[a-z A-Z] [a-z A-Z_0-9]*/,
  NL:      { match: /\n/, lineBreaks: true },
})

lexer.reset(`print("test")`);

while (true) {
    const token = lexer.next();
    if (!token) {
        break;
    }
    console.log(token);
}
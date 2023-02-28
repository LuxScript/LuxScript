function untokenize(tokens) {
    let untokenizedCode = '';
    for (const token of tokens) {
      untokenizedCode += token.value;
    }
  
    const KEYWORDS = {
      IF: "if",
      ELSE: "else",
      WHILE: "while",
      FOR: "for",
      FUNCTION: "function",
    };
  
    const OPERATORS = {
      PLUS: "+",
      MINUS: "-",
      MULTIPLY: "*",
      DIVIDE: "/",
      ASSIGN: "=",
      EQUALS: "==",
      NOT_EQUALS: "!=",
      LESS_THAN: "<",
      GREATER_THAN: ">",
      LESS_THAN_EQUALS: "<=",
      GREATER_THAN_EQUALS: ">=",
    };
  
    const PUNCTUATION = {
      LEFT_PAREN: "(",
      RIGHT_PAREN: ")",
      LEFT_BRACE: "{",
      RIGHT_BRACE: "}",
      COMMA: ",",
      SEMICOLON: ";",
      DOT: ".",
      NONE: "none",
    };
  
    for (const keyword in KEYWORDS) {
      untokenizedCode = untokenizedCode.replace(new RegExp(keyword, 'g'), KEYWORDS[keyword]);
    }
  
    for (const operator in OPERATORS) {
      untokenizedCode = untokenizedCode.replace(new RegExp(operator, 'g'), OPERATORS[operator]);
    }
  
    for (const punctuation in PUNCTUATION) {
      untokenizedCode = untokenizedCode.replace(new RegExp(punctuation, 'g'), PUNCTUATION[punctuation]);
    }
  
    return untokenizedCode;
}
module.exports = untokenize;
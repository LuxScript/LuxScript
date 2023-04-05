function untokenize(tokens) {
  let untokenizedCode = '';
  for (const token of tokens) {
    if (token.type === 'STRING') {
      untokenizedCode += `"${token.value}"`;
    } else if (token.type === 'STRINGVAR') {
      untokenizedCode += `\`${token.value}\``;
    } else {
      untokenizedCode += token.value;
    }
  }

  const KEYWORDS = {
    IF: "if",
    WHETHER: "if",
    ELSE: "else",
    WHILE: "while",
    FUNCTION: "function",
    SWITCH: "switch",
    CASE: "case",
    WHIDO: "whido",
    NEW: "new",
    DEF: "def",
    ASSIGN: "=",
    AS: "as",
    TO: "==",
    REALLY_EQUALS: "===",
    REALLY_NOT_EQUALS: "!==",
    NOT_EQUALS: "!=",
    LESS_THAN_EQUALS: "<=",
    GREATER_THAN_EQUALS: ">=",
    EQUALS: "=",
    LESS_THAN: "<",
    GREATER: ">",
    DOCUMENT: "document"
  };

  const OPERATORS = {
    PLUS: "+",
    MINUS: "-",
    MULTIPLY: "*",
    DIVIDE: "/",
    ASSIGN: "=",
    PLUS_ASSIGN: "+=",
    PLUS_ASSIGN: "=+",
    MINUS_ASSIGN: "-=",
    MINUS_ASSIGN: "=-",
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
    LEFT_BAR: "[",
    RIGHT_BAR: "]",
    COMMA: ",",
    SEMICOLON: ";",
    COLON: ":",
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
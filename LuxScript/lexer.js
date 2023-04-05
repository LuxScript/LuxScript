const TokenType = require("./Lexer/tokentype");
const Token = require("./Lexer/token");
const KEYWORDS = require("./Lexer/keywords");
const OPERATORS = require("./Lexer/operators");
const PUNCTUATION = require("./Lexer/punctuation");


module.exports = class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.tokens = [];
    }
    lex() {
        const inputLength = this.input.length;
        const tokens = [];

        while (this.position < inputLength) {
            const currentChar = this.input[this.position];

            switch (currentChar) {
                case '"':
                    this.lexDoubleQuotedString();
                break;
                case "'":
                    this.lexSingleQuotedString();
                break;
                case '`':
                    this.lexBacktickQuotedString();
                break;
                case '(':
                case ')':
                case '{':
                case '}':
                case '[':
                case ']':
                case ',':
                case ';':
                case ':':
                case '.':
                    this.lexPunctuation();
                    if (currentChar === ';') {
                        this.lexPunctuation();
                    }
                break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '=':
                case '>':
                case '<':
                case '!':
                    this.lexOperator();
                break;
                case '#':
                    this.lexComment();
                break;
                default:
                    if (currentChar === ' ' || currentChar === '\t' || currentChar === '\r' || currentChar === '\n') {
                        this.position++;
                    } else if (currentChar >= '0' && currentChar <= '9') {
                        this.lexNumber();
                    } else if ((currentChar >= 'a' && currentChar <= 'z') || (currentChar >= 'A' && currentChar <= 'Z') || currentChar === '_') {
                        this.lexIdentifier();
                    } else {
                        throw new Error(`Invalid character: ${currentChar}`);
                    }
                break;
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
        this.position++;
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
        this.position++;
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
        this.position++;
        this.tokens.push(new Token(TokenType.STRINGVAR, str));
    }
    lexIdentifier() {
        let identifier = "";
        while (/[a-zA-Z\d_]/.test(this.input[this.position])) {
            identifier += this.input[this.position];
            this.position++;
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
        this.position += 2;
        if (this.input[this.position] === "#") {
            this.position++;
            let depth = 1;
            while (depth > 0 && this.position < this.input.length) {
                const currentChar = this.input[this.position];
                if (currentChar === "#" && this.input[this.position + 1] === "*" && this.input[this.position + 2] === "*") {
                    depth++;
                    this.position += 3;
                } else if (currentChar === "*" && this.input[this.position + 1] === "*" && this.input[this.position + 2] === "#") {
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
            while (this.position < this.input.length && this.input[this.position] !== "\n") {
                this.position++;
            }
        }
        const comment = this.input.slice(start, this.position);
        this.tokens.push(new Token(TokenType.COMMENT, comment));
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
        this.position++;
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
        this.position++;
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
        const punctuationType = PUNCTUATION[punctuation];
        if (punctuationType) {
            this.tokens.push(new Token(TokenType.PUNCTUATION, punctuationType));
        }
        this.position++;
    }
}

const c = require('chalk');
let errs = "Error: ";
let file;
const error = {
    setContext: (_file)=> {
        file = _file;
    },

    1: () => console.log(
c.red("\n" + errs) + c.gray(`You can only use the variable type: set.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE1\n`))
),

    2: () => console.log(
c.red("\n" + errs) + c.gray(`You can't load a LuxScript file that does not exist.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE2\n`))
),

    3: () => console.log(
c.red("\n" + errs) + c.gray(`There are no arguments for the function print.clear\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE3\n`))
),

    4: () => console.log(
c.red("\n" + errs) + c.gray(`Failed the scan.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE4\n`))
),

    5: () => console.log(
c.red("\n" + errs) + c.gray(`This argument is only made for a variable creation.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE5\n`))
),

    6: () => console.log(
c.red("\n" + errs) + c.gray(`Did you mean print?\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE6\n`))
),

    7: () => console.log(
c.red("\n" + errs) + c.gray(`Did you mean set?\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE7\n`))
),

    8: () => console.log(
c.red("\n" + errs) + c.gray(`Did you mean import?\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE8\n`))
),

    9: () => console.log(
c.red("\n" + errs) + c.gray(`You can't read a file that is empty.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE9\n`))
),

    10: () => console.log(
c.red("\n" + errs) + c.gray(`You can't create a variable with the name true.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE10\n`))
),

    11: () => console.log(
c.red("\n" + errs) + c.gray(`You can't create a variable with the name false.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE11\n`))
),

    12: () => console.log(
c.red("\n" + errs) + c.gray(`You can't create a variable with the name def.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE12\n`))
),

    13: () => console.log(
c.red("\n" + errs) + c.gray(`You can't create a variable with the name if.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE13\n`))
),

    14: () => console.log(
c.red("\n" + errs) + c.gray(`You can't read a file that doesn't exist\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE14\n`))
),

    15: () => console.log(
c.red("\n" + errs) + c.gray(`You can't write a file that doesn't exist\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE14\n`))
),

    16: () => console.log(
c.red("\n" + errs) + c.gray(`You can't make a folder if it already exists!\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE16\n`))
),

    17: () => console.log(
c.red("\n" + errs) + c.gray(`You can't remove a file that doesn't exist.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE17\n`))
),

    18: () => console.log(
c.red("\n" + errs) + c.gray(`You can't remove a directory that doesn't exist.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE18\n`))
),

    19: () => console.log(
c.red("\n" + errs) + c.gray(`You can't set a string to something that is not a string.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE19\n`))
),

    20: () => console.log(
c.red("\n" + errs) + c.gray(`You can't set a integer to something that is not a integer.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE20\n`))
),

    21: () => console.log(
c.red("\n" + errs) + c.gray(`You can't change a string variable into a integer if it contains letters.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE21\n`))
),

    22: () => console.log(
c.red("\n" + errs) + c.gray(`You can't calculate a string.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE22\n`))
),

    23: () => console.log(
c.red("\n" + errs) + c.gray(`You can't define a string.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE23\n`))
),

    24: () => console.log(
c.red("\n" + errs) + c.gray(`You can't open a html file that doesn't exist.\n`
+ c.gray("In " + __dirname + "\n")
+ c.gray("  In " + __dirname.slice(0, - 9) + file + "\n\n")
+ c.keyword("blue")(`Error code: `) + c.keyword('orange')(`LxE24\n`))
)

}
module.exports = error;

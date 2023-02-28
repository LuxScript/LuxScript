let errs = "Error: ";
const error = {
    1: () => console.log(errs + "You can only use the variable type: let."),
    2: () => console.log(errs + "You can't load a LuxScript file that does not exist."),
    3: () => console.log(errs + "There are no arguments for the function print.clear"),
    4: () => console.log(errs + "Your current code is missing a bracket. Please verify it and retry.")
}
module.exports = error;
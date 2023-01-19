export
function line(variable, text) {
    var string = variable;
    var string2 = text;
    var string = string.trim().substring(0,  string.trim().indexOf(string2));
    var string = string.split('\n').length;
    return string;
}
// Error
export
function sendError(string) {
    console.log(error + error);
}
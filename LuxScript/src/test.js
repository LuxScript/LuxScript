let string = "line 1\nline 2\nline 3\nline 4\nline 5d";
let lines = string.split("\n");
let lastLineWithD = lines.filter(line => line.includes("d")).pop();
console.log(lastLineWithD);
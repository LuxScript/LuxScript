/*
if (tok[i][0]["value"] === "SWITCH" || tok[i][1]["value"] === "CASE") {
  if (variable[tok[i][2]["value"]] === tok[i][6]["value"]) {
    let [, , , , , , , , ...tokSC] = tok[i];
    run(untokenize(tokSC));
  }
  let tokySC = {...tok[i + 1]};
  if (variable[tok[i][2]["value"]] !== tok[i][2]) {
    let tokySC = [...tok[i]];
    if (Array.isArray(tokySC)) {
      tokySC.shift();
      tokySC.shift();
      tokySC.shift();
      tokySC.shift();
      console.log(tokySC);
    }
  }
}
*/
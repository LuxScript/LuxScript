if (getI["circle"] && getI["circle"]["circle"] === true) {
    if (getI["circle"]["circleAs"] !== "") {
      if (tok[i][0]["value"] === getI["circle"]["circleAs"]) {
        if (tok[i][1]["value"] == "DOT") {
          if (tok[i][2]["value"] === "findr") {
            if (tok[i][3]["value"] === "LEFT_PAREN") {
              if (tok[i][4]["type"] === "IDENTIFIER") {
                var value = variable[tok[i][4]["value"]];
              } else {
                var value = tok[i][4]["value"];
              }
              let r = value;
              let d = 2 * r;
              let c = 2 * Math.PI * r;
              let a = Math.PI * r * r;
              let total = {
                "radius": r,
                "diameter": d,
                "circumference": c,
                "air": a
              };
              if (tok[i][6]["value"] === "DEF") {
                if (tok[i][7]["value"] === "LEFT_PAREN") {
                  if (tok[i][8]["type"] === "STRING") {
                    error[23]();
                    process.exit(0);
                  }
                  variableName = tok[i][8]["value"];
                  variable[tok[i][1]["value"]] = {};
                  variable[tok[i][8]["value"]] = total;
                }
              } else {
                error[5]();
                process.exit(0);
              }
            }
          }
          if (tok[i][2]["value"] === "findd") {
            if (tok[i][3]["value"] === "LEFT_PAREN") {
              if (tok[i][4]["type"] === "IDENTIFIER") {
                var value = variable[tok[i][4]["value"]];
              } else {
                var value = tok[i][4]["value"];
              }
              let d = value;
              let r = d / 2;
              let c = 2 * Math.PI * r;
              let a = Math.PI * r * r;
              let total = {
                "radius": r,
                "diameter": d,
                "circumference": c,
                "air": a
              };
              if (tok[i][6]["value"] === "DEF") {
                if (tok[i][7]["value"] === "LEFT_PAREN") {
                  if (tok[i][8]["type"] === "STRING") {
                    error[23]();
                    process.exit(0);
                  }
                  variableName = tok[i][8]["value"];
                  variable[tok[i][1]["value"]] = {};
                  variable[tok[i][8]["value"]] = total;
                }
              }
            }
          }
          if (tok[i][2]["value"] === "findc") {
            if (tok[i][3]["value"] === "LEFT_PAREN") {
              if (tok[i][4]["type"] === "IDENTIFIER") {
                var value = variable[tok[i][4]["value"]];
              } else {
                var value = tok[i][4]["value"];
              }
              let c = value;
              let r = c / (2 * Math.PI)
              let d = r * 2;
              let a = Math.PI * r * r;
              let total = {
                "radius": r,
                "diameter": d,
                "circumference": c,
                "air": a
              };
              if (tok[i][6]["value"] === "DEF") {
                if (tok[i][7]["value"] === "LEFT_PAREN") {
                  if (tok[i][8]["type"] === "STRING") {
                    error[23]();
                    process.exit(0);
                  }
                  variableName = tok[i][8]["value"];
                  variable[tok[i][1]["value"]] = {};
                  variable[tok[i][8]["value"]] = total;
                }
              }
            }
          }
          if (tok[i][2]["value"] === "finda") {
            if (tok[i][3]["value"] === "LEFT_PAREN") {
              if (tok[i][4]["type"] === "IDENTIFIER") {
                var value = variable[tok[i][4]["value"]];
              } else {
                var value = tok[i][4]["value"];
              }
              let a = value;
              let r = Math.sqrt(a / Math.PI);
              let d = r * 2;
              let c = 2 * Math.PI * r;
              let total = {
                "radius": r,
                "diameter": d,
                "circumference": c,
                "air": a
              };
              if (tok[i][6]["value"] === "DEF") {
                if (tok[i][7]["value"] === "LEFT_PAREN") {
                  if (tok[i][8]["type"] === "STRING") {
                    error[23]();
                    process.exit(0);
                  }
                  variableName = tok[i][8]["value"];
                  variable[tok[i][1]["value"]] = {};
                  variable[tok[i][8]["value"]] = total;
                }
              }
            }
          }
        }
      }
    }
}
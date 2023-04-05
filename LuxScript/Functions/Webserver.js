if (getI["http"] && getI["http"]["http"] === true) {
    if (getI["http"]["httpAs"] !== "") {
      if (tok[i][0]["value"] === getI["http"]["httpAs"]) {
        if (tok[i][1]["value"] === "DOT") {
          if (tok[i][2]["value"] === "createserver") {
            if (tok[i][3]["value"] === "LEFT_PAREN") {
              if (tok[i][4]["type"] === "STRING") {
                var html = tok[i][4]["value"]
              }
              if (tok[i][4]["type"] === "IDENTIFIER") {
                var html = variable[tok[i][4]["value"]];
              }
              if (tok[i][6]["type"] === "NUMBER") {
                var port = tok[i][6]["value"];
              }
              if (tok[i][6]["type"] === "IDENTIFIER") {
                var port = variable[tok[i][6]["value"]];
              }
              const server = http.createServer((request, response) => {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(html);
                response.end();
              });
              if (tok[i][5]["value"] === "COMMA") {
                if (tok[i][6]) {
                  server.listen(port, () => {
                  });
                } else {
                  console.log("Error: No port specified");
                }
              }
            }
          }
        }
      }
    }
}
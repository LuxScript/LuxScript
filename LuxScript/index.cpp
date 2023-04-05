#include <iostream>
#include <fstream>
#include <string>
#include <iomanip>
#include <sstream>
#include "lib/json.hpp"

using json = nlohmann::json;

int main() {
  std::ifstream infile("./LuxScript/Transfer/cpp.lxt");
  std::ifstream infile2("./LuxScript/Transfer/cppvar.lxt");
  std::string line, line2;

  while (std::getline(infile, line) && std::getline(infile2, line2)) {
    json tok = json::parse(line);
    json variable = json::parse(line2);
    for (int i = 0; i < tok.size(); i++) {
      if (tok[i][0]["value"] == "print") {
        if (tok[i][1]["value"] == "DOT") {
          if (tok[i][2]["value"] == "center") {
            if (tok[i][3]["value"] == "LEFT_PAREN") {
              std::stringstream ss;
              ss << std::noskipws << variable;
              std::string variable_str = ss.str();

              if (tok[i][4]["type"] == "IDENTIFIER") {
                std::string text = variable[tok[i][4]["value"]];
                int width = 40;
                int padding = (width - text.length()) / 2;
                std::cout << std::setw(padding + text.length()) << text;
              } else {
                std::string text = tok[i][4]["value"];
                int width = 40;
                int padding = (width - text.length()) / 2;
                std::cout << std::setw(padding + text.length()) << text;
              }
            }
          }
        }
      }
      // GUI...
    }
  }

  infile.close();
  infile2.close();
  return 0;
}
import glob
import os
import json
import re
import sys

with open("./LuxScript/LuxScriptConfig.json", "r") as index:
    index = "\n".join([line for line in index if "#" not in line])
    if index == '':
        sys.exit()
    index = json.loads(index)
y = os.getcwd()
x = glob.glob(y + index['Folder'] + "*")
f = open(x[0], "r")
lines = f.readlines()

for line in lines:

    # The code
    # Comments
    if line:
        line = re.sub(r'^.*\/\/.*$', '', line, flags=re.MULTILINE)
    # Testings
    if line.startswith("$python$"):
        eval(line.replace("$python$", ""))
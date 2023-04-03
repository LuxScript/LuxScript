import argparse
import subprocess

parser = argparse.ArgumentParser(prog='lx')
parser.add_argument('file_name', type=str, help='a string argument')
args = parser.parse_args()

file_name = args.file_name
if file_name == 'gui':
    subprocess.run(['powershell.exe', '-Command', 'py ./LuxScript/Gui/gui.py'])
    exit(0)

with open("./LuxScript/Transfer/transfer.lxt", "w") as file:
    file.write(file_name)

with open("./LuxScript/Command/command.bat", "w") as file:
    file.write(f"node LuxScript\\MAIN.js {file_name}")

result = subprocess.run(['powershell.exe', '-Command', 'LuxScript\\Command\\command.bat'], capture_output=True, text=True)
print(result.stdout.strip())
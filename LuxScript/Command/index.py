import sys
import subprocess

def main():
    def run_powershell_command(command):
        result = subprocess.run(['powershell.exe', command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.stdout.decode(errors='ignore'), result.stderr.decode(errors='ignore')
    if len(sys.argv) != 3 or sys.argv[1] != "luxscript":
        if sys.argv[1] == "--gui":
            stdout, stderr = run_powershell_command('py ./LuxScript/App/app.py')
            print(stdout)
            with open("./LuxScript/Transfer/transfer.lxt", "w") as file2:
                file2.write("")
                file2.close
        file = open("./LuxScript/Transfer/transfer.lxt", "w")
        file.write(sys.argv[1])
        file.close()

if __name__ == "__main__":
    main()
import sys
import subprocess

def main():
    def run_powershell_command(command):
        result = subprocess.run(['powershell.exe', command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.stdout.decode(errors='ignore'), result.stderr.decode(errors='ignore')
    if len(sys.argv) != 3 or sys.argv[1] != "luxscript":
        if sys.argv[1] == "--testrun":
            stdout, stderr = run_powershell_command('./LuxScript/testrun')
            print(stdout)
        stdout, stderr = run_powershell_command('./LuxScript/drun')
        # Open a file for writing
        file = open("./LuxScript/src/transfer.lxt", "w")

        # Write some text to the file
        file.write(sys.argv[1])

        # Close the file
        file.close()

if __name__ == "__main__":
    main()
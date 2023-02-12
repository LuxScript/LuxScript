# Install
You will need to create a file in the location "windows/system32" that is "luxscript.bat" and you will need to put this code inside it:
```Batch

@echo off
python LuxScript\src\command.py %*
./LuxScript/drun

```
Then you need to install Node.js and Python.
To check if you have everything installed execute the command "luxscript --testrun".
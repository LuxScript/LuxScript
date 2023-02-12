using System;

// Getting the full path to the project
var dir = Path.GetFullPath(".\\");

// Reading the directory
string[] dirF = Directory.GetFileSystemEntries(dir, "*.sms");
foreach(string fileName in dirF) {

    // Reading all the files
    string data = File.ReadAllText(dir + "Scripts" + fileName);
}
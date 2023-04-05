import tkinter as tk
import subprocess
from tkinter import scrolledtext, filedialog

def run_command(command):
    script = editor.get('1.0', tk.END)
    file = open("./LuxScript/GUI.lx", "w")
    file.write(script)
    file.close()
    result = subprocess.run(['powershell.exe', '-Command', command], capture_output=True, text=True)
    output_lines = result.stdout.strip().split('\n')
    output_lines.pop(0)
    console.insert(tk.END, result.stdout + "--LuxScript--\n")


def button():
    run_command("lx ./LuxScript/GUI.lx")


def handle_keypress(event):
    char = event.char
    if char == '"' and editor.get(tk.INSERT+'-1c') != '\\':
        editor.insert(tk.INSERT, '"')
        editor.icursor(tk.END)
        return 'break'


def on_close():
    script = editor.get('1.0', tk.END)
    file = open("./LuxScript/Transfer/guiSave.lxt", "w")
    file.write(script)
    file.close()
    window.destroy()

def highlight_parentheses(event=None):
    editor.tag_remove("paren", "1.0", tk.END)
    current_index = editor.index("insert")
    current_line_number = int(current_index.split(".")[0])
    current_line_start = f"{current_line_number}.0"
    current_line_end = f"{current_line_number}.end"
    current_line_text = editor.get(current_line_start, current_line_end)
    
    for index, char in enumerate(current_line_text):
        if char == "(":
            editor.tag_add(char, f"{current_line_start}+{index}c", f"{current_line_start}+{index+1}c")
            editor.tag_config(char, foreground="orange")
        if char == ")":
            editor.tag_add(char, f"{current_line_start}+{index}c", f"{current_line_start}+{index+1}c")
            editor.tag_config(char, foreground="orange")
        if char == "{":
            editor.tag_add(char, f"{current_line_start}+{index}c", f"{current_line_start}+{index+1}c")
            editor.tag_config(char, foreground="red")
        if char == "}":
            editor.tag_add(char, f"{current_line_start}+{index}c", f"{current_line_start}+{index+1}c")
            editor.tag_config(char, foreground="red")
        if char == ";":
            editor.tag_add(char, f"{current_line_start}+{index}c", f"{current_line_start}+{index+1}c")
            editor.tag_config(char, foreground="blue")
        if char == "\"":
            editor.tag_add(char, f"{current_line_start}+{index}c", f"{current_line_start}+{index+1}c")
            editor.tag_config(char, foreground="darkgreen")
        if char in ["[", "]"]:
            editor.tag_add(char, f"{current_line_start}+{index}c", f"{current_line_start}+{index+1}c")
            editor.tag_config(char, foreground="purple")
        if char == "#":
            editor.tag_add(char, f"{current_line_start}+{index}c", f"{current_line_end}")
            editor.tag_config(char, foreground="gray")
            break

def send_console_command(event=None):
    command = console.get('end-1l linestart', 'end-1c')
    console.insert(tk.END, '\n')
    run_command(command)

def block_console_editing(event=None):
    if console.index(tk.INSERT) < console.index("end-1c"):
        return 'break'

def on_open():
    try:
        file = open("./LuxScript/Transfer/guiSave.lxt", "r")
        script = file.read()
        editor.insert(tk.END, script)
        editor.tag_add("bold", "1.0", tk.END)
        editor.configure(background="lightgray", font=("Calibri", 13, "normal"))
        file.close()
    except FileNotFoundError:
        pass

window = tk.Tk()
window.title("LuxScript")
window.iconbitmap('./LuxScript/Gui/Logo.ico')
window.geometry("500x400")
window.configure(background="lightgray")

def open_file():
    file_path = filedialog.askopenfilename(filetypes=[('LuxScript files', '*.lx'), ('All files', '*.*')])
    if file_path:
        try:
            with open(file_path, 'r') as file:
                content = file.read()
                editor.delete('1.0', tk.END)
                editor.insert('1.0', content)
        except Exception as e:
            console.insert(tk.END, f'Error opening file: {str(e)}\n')

open_button = tk.Button(window, text="Open", command=open_file)
open_button.pack(side=tk.TOP, anchor=tk.NE)
open_button.pack(side=tk.TOP, anchor=tk.NW)
open_button.pack(side=tk.RIGHT)

button = tk.Button(window, text="Run", command=button)
button.pack(side=tk.TOP, anchor=tk.NW)
button.pack(side=tk.RIGHT)

editor = scrolledtext.ScrolledText(window, width=50, height=20)
editor.pack(fill='both', expand=True)
editor.bind("<Key>", handle_keypress)
editor.configure(background="lightgray")
editor.bind("<Key>", highlight_parentheses)

console = scrolledtext.ScrolledText(window, width=50, height=10)
console.pack(fill='both', expand=True)
console.configure(background="lightgray")
console.bind('<Return>', send_console_command)
console.bind("<Key>", block_console_editing)

window.protocol("WM_DELETE_WINDOW", on_close)
on_open()
window.mainloop()
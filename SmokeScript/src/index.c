#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    FILE* ptr;
    char ch;
    char data;
    ptr = fopen("test.txt", "r");
    do {
        data = fgetc(ptr);
        printf("%c", data);
    } while (ch != EOF);
    fclose(ptr);
    return 0;
}
#include <stdio.h>
#define SIZE 10

int hashTable[SIZE];

void init() {
    for (int i = 0; i < SIZE; i++)
        hashTable[i] = -1;
}

int hash(int key) {
    return key % SIZE;
}

void insert(int pnr) {
    int index = hash(pnr);

    while (hashTable[index] != -1)
        index = (index + 1) % SIZE;

    hashTable[index] = pnr;
    printf("PNR %d stored.\n", pnr);
}

void search(int pnr) {
    int index = hash(pnr);

    while (hashTable[index] != -1) {
        if (hashTable[index] == pnr) {
            printf("PNR %d found!\n", pnr);
            return;
        }
        index = (index + 1) % SIZE;
    }

    printf("PNR not found.\n");
}

int main() {
    int choice, pnr;
    init();

    while (1) {
        printf("\n1.Add PNR  2.Search PNR  3.Exit\n");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter PNR: ");
                scanf("%d", &pnr);
                insert(pnr);
                break;
            case 2:
                printf("Enter PNR: ");
                scanf("%d", &pnr);
                search(pnr);
                break;
            case 3:
                return 0;
        }
    }
}
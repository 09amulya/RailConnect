#include <stdio.h>
#include <stdlib.h>

struct Node {
    int pnr;
    struct Node* next;
};

struct Node* head = NULL;

void addWaiting(int pnr) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->pnr = pnr;
    newNode->next = NULL;

    if (head == NULL)
        head = newNode;
    else {
        struct Node* temp = head;
        while (temp->next != NULL)
            temp = temp->next;
        temp->next = newNode;
    }

    printf("Passenger added to Waiting List (PNR: %d)\n", pnr);
}

void confirmTicket() {
    if (head == NULL) {
        printf("No waiting passengers.\n");
        return;
    }
    struct Node* temp = head;
    printf("Confirmed ticket for PNR: %d\n", temp->pnr);
    head = head->next;
    free(temp);
}

void display() {
    struct Node* temp = head;
    printf("Waiting List: ");
    while (temp != NULL) {
        printf("%d -> ", temp->pnr);
        temp = temp->next;
    }
    printf("NULL\n");
}

int main() {
    int choice, pnr;

    while (1) {
        printf("\n1.Add WL  2.Confirm Ticket  3.Display  4.Exit\n");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter PNR: ");
                scanf("%d", &pnr);
                addWaiting(pnr);
                break;
            case 2:
                confirmTicket();
                break;
            case 3:
                display();
                break;
            case 4:
                return 0;
        }
    }
}
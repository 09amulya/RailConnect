#include <stdio.h>
#define MAX 5

int queue[MAX];
int front = -1, rear = -1;

void enqueue(int pnr) {
    if (rear == MAX - 1) {
        printf("Booking Queue Full!\n");
        return;
    }
    if (front == -1) front = 0;
    queue[++rear] = pnr;
    printf("Booking request added (PNR: %d)\n", pnr);
}

void dequeue() {
    if (front == -1 || front > rear) {
        printf("No booking requests.\n");
        return;
    }
    printf("Processing booking for PNR: %d\n", queue[front++]);
}

void display() {
    if (front == -1 || front > rear) {
        printf("Queue empty\n");
        return;
    }
    printf("Pending Bookings: ");
    for (int i = front; i <= rear; i++)
        printf("%d ", queue[i]);
    printf("\n");
}

int main() {
    int choice, pnr;

    while (1) {
        printf("\n1.Add Booking  2.Process Booking  3.Display  4.Exit\n");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter PNR: ");
                scanf("%d", &pnr);
                enqueue(pnr);
                break;
            case 2:
                dequeue();
                break;
            case 3:
                display();
                break;
            case 4:
                return 0;
        }
    }
}
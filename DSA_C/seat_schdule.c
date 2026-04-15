#include <stdio.h>
#include <string.h>

#define MAX_TRAINS 5

// Structure for Train
struct Train {
    int number;
    char name[50];
    char source[30];
    char destination[30];
    int totalSeats;
    int availableSeats;
};

// Array of trains
struct Train trains[MAX_TRAINS];

// Initialize train data
void initialize() {
    trains[0] = (struct Train){101, "Rajdhani Express", "Delhi", "Mumbai", 100, 80};
    trains[1] = (struct Train){102, "Shatabdi Express", "Delhi", "Chandigarh", 80, 60};
    trains[2] = (struct Train){103, "Duronto Express", "Mumbai", "Kolkata", 120, 90};
    trains[3] = (struct Train){104, "Garib Rath", "Delhi", "Lucknow", 150, 120};
    trains[4] = (struct Train){105, "Intercity Express", "Chennai", "Bangalore", 90, 50};
}

// Display all trains
void displayTrains() {
    printf("\nAvailable Trains:\n");
    for (int i = 0; i < MAX_TRAINS; i++) {
        printf("\nTrain No: %d\n", trains[i].number);
        printf("Name: %s\n", trains[i].name);
        printf("Route: %s -> %s\n", trains[i].source, trains[i].destination);
        printf("Seats Available: %d/%d\n",
               trains[i].availableSeats, trains[i].totalSeats);
    }
}

// Search train by number
int searchTrain(int num) {
    for (int i = 0; i < MAX_TRAINS; i++) {
        if (trains[i].number == num)
            return i;
    }
    return -1;
}

// Book ticket
void bookTicket() {
    int num;
    printf("\nEnter Train Number: ");
    scanf("%d", &num);

    int index = searchTrain(num);

    if (index == -1) {
        printf("Train not found!\n");
        return;
    }

    if (trains[index].availableSeats > 0) {
        trains[index].availableSeats--;
        printf("✅ Booking Successful!\n");
        printf("Seats left: %d\n", trains[index].availableSeats);
    } else {
        printf("❌ No seats available. Added to waiting list.\n");
    }
}

int main() {
    int choice;

    initialize();

    while (1) {
        printf("\n--- Railway System ---\n");
        printf("1. View Trains\n");
        printf("2. Book Ticket\n");
        printf("3. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                displayTrains();
                break;
            case 2:
                bookTicket();
                break;
            case 3:
                return 0;
            default:
                printf("Invalid choice!\n");
        }
    }
}
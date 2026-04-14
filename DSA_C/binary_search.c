#include <stdio.h>

int binarySearch(int arr[], int n, int key) {
    int low = 0, high = n - 1;

    while (low <= high) {
        int mid = (low + high) / 2;

        if (arr[mid] == key)
            return mid;
        else if (arr[mid] < key)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}

int main() {
    int n, key;

    printf("Enter number of trains: ");
    scanf("%d", &n);

    int trains[n];

    printf("Enter sorted train numbers:\n");
    for (int i = 0; i < n; i++)
        scanf("%d", &trains[i]);

    printf("Enter train number to search: ");
    scanf("%d", &key);

    int result = binarySearch(trains, n, key);

    if (result != -1)
        printf("Train found at position %d\n", result + 1);
    else
        printf("Train not found\n");

    return 0;
}
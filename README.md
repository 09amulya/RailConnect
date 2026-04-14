# 🚆 Smart Railway Reservation System 
A **Data Structures and Algorithms (DSA)** based Railway Reservation System prototype that simulates real-world train booking logic similar to IRCTC.

This project demonstrates how core DSA concepts can be applied to solve real-world problems like ticket booking, waiting list management, and fast data retrieval.

---

## 📌 Features

### 🔍 Train Search

* Search trains between source and destination
* Multiple trains available for same route
* Uses **Binary Search** for efficient lookup

### 🚆 Train Details

* Train number, name, timings, duration
* Running days
* Available classes (SL, 3AC, 2AC)

### 📅 Seat Availability (IRCTC Style)

* Shows availability for multiple dates
* Status:

  * ✅ Available
  * ⚠ Limited
  * ❌ Waiting List
* Booking probability (High / Medium / Low)
* Color-based UI (Green / Yellow / Red)

### 🎟 Booking System

* Booking handled using **Queue (FIFO)**
* Automatic seat allocation
* Waiting list if seats are full

### 🔗 Waiting List Management

* Implemented using **Linked List**
* On cancellation:

  * First waiting passenger gets confirmed

### 🔑 PNR System

* Unique PNR generated for each booking
* Stored using **Hash Map**
* Instant lookup in O(1) time

### 📊 My Bookings

* View confirmed and waiting tickets
* Cancel booking feature
* Sorted using **Merge Sort**

### 🧠 DSA Visualization Panel

* Live visualization of:

  * Array (Train Data)
  * Queue (Booking Requests)
  * Linked List (Waiting List)
  * Hash Map (PNR Records)

---

## 🧠 DSA Concepts Used

| Feature          | Data Structure / Algorithm |
| ---------------- | -------------------------- |
| Train Storage    | Array                      |
| Train Search     | Binary Search              |
| Booking Requests | Queue                      |
| Waiting List     | Linked List                |
| PNR Lookup       | Hashing (Map)              |
| Sorting Bookings | Merge Sort                 |

---

## 🛠 Tech Stack

* **HTML5**
* **CSS3**
* **JavaScript (Vanilla)**

---

## 📂 Project Structure

```
Railway-DSA-Project/
│
├── index.html
├── style.css
├── script.js
│
├── dsa-in-c/
│   ├── queue.c
│   ├── linked_list.c
│   ├── binary_search.c
│   ├── merge_sort.c
│   ├── hashing.c
```

---


## 🎯 Project Objective

The goal of this project is to:

* Demonstrate real-world application of DSA
* Simulate railway booking system behavior
* Provide an interactive and visual learning experience

---

## 💡 Future Improvements

* Backend integration (Node.js + MongoDB)
* User authentication system
* Real-time seat updates
* Payment gateway simulation
* Mobile responsiveness improvements

---

## 👨‍💻 Author

* Name: *Amulya Pratap Singh*
* Course: B.Tech (CSE)
* Subject: Data Structures and Algorithms

---

## ⭐ Conclusion

This project bridges the gap between **theoretical DSA concepts** and **real-world system design**, making it a practical implementation of algorithm-driven problem solving.

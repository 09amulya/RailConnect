/*=============================================================
  RailConnect – Smart Railway Reservation System
  JavaScript – Full DSA Implementation
  
  DSA Used:
  1. Array + Binary Search   → train lookup
  2. Queue (class)           → booking requests (FIFO)
  3. Linked List (class)     → waiting list (true nodes)
  4. Hash Map (object)       → PNR storage O(1)
  5. Merge Sort              → sort bookings by date/time
=============================================================*/

"use strict";

// ─────────────────────────────────────────────
//  1. DATASET – 30 realistic Indian trains
// ─────────────────────────────────────────────
const TRAIN_DATA = [
  // Mumbai ↔ Delhi
  { id:"12951", name:"Mumbai Rajdhani Express",  from:"MMCT", to:"NDLS", dep:"17:00", arr:"08:35", dur:"15h 35m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["1AC","2AC","3AC"], fares:{SL:null,"1AC":3800,"2AC":2200,"3AC":1520}, totalSeats:{SL:0,"1AC":18,"2AC":48,"3AC":64} },
  { id:"12953", name:"August Kranti Rajdhani",   from:"MMCT", to:"NDLS", dep:"17:40", arr:"10:55", dur:"17h 15m", days:["Mon","Wed","Fri","Sat","Sun"],             classes:["1AC","2AC","3AC"], fares:{SL:null,"1AC":3600,"2AC":2100,"3AC":1450}, totalSeats:{SL:0,"1AC":18,"2AC":48,"3AC":64} },
  { id:"12137", name:"Punjab Mail",              from:"MMCT", to:"NDLS", dep:"19:25", arr:"12:45", dur:"17h 20m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:510,"2AC":1890,"3AC":1260},              totalSeats:{SL:400,"2AC":48,"3AC":64} },
  { id:"12903", name:"Golden Temple Mail",       from:"MMCT", to:"NDLS", dep:"21:30", arr:"16:25", dur:"18h 55m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:490,"2AC":1810,"3AC":1200},              totalSeats:{SL:380,"2AC":48,"3AC":56} },

  // Delhi ↔ Kolkata
  { id:"12301", name:"Howrah Rajdhani",          from:"NDLS", to:"HWH",  dep:"16:55", arr:"09:55", dur:"17h 00m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["1AC","2AC","3AC"], fares:{SL:null,"1AC":3400,"2AC":2000,"3AC":1350}, totalSeats:{SL:0,"1AC":18,"2AC":48,"3AC":64} },
  { id:"12303", name:"Poorva Express",           from:"NDLS", to:"HWH",  dep:"08:00", arr:"06:50", dur:"22h 50m", days:["Mon","Wed","Fri","Sat","Sun"],             classes:["SL","2AC","3AC"],  fares:{SL:440,"2AC":1680,"3AC":1120},              totalSeats:{SL:500,"2AC":48,"3AC":64} },
  { id:"12381", name:"Poorva Express (via Gaya)",from:"NDLS", to:"HWH",  dep:"10:10", arr:"12:50", dur:"26h 40m", days:["Tue","Thu","Sat"],                         classes:["SL","2AC","3AC"],  fares:{SL:420,"2AC":1620,"3AC":1080},              totalSeats:{SL:480,"2AC":48,"3AC":56} },

  // Mumbai ↔ Chennai
  { id:"11041", name:"Chennai Express",          from:"MMCT", to:"MAS",  dep:"21:00", arr:"08:00", dur:"23h 00m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:460,"2AC":1740,"3AC":1160},              totalSeats:{SL:500,"2AC":48,"3AC":64} },
  { id:"16381", name:"Mumbai–Kanyakumari Exp",   from:"MMCT", to:"MAS",  dep:"11:30", arr:"22:20", dur:"34h 50m", days:["Tue","Thu","Sat","Sun"],                   classes:["SL","2AC","3AC"],  fares:{SL:480,"2AC":1760,"3AC":1170},              totalSeats:{SL:460,"2AC":48,"3AC":56} },

  // Delhi ↔ Chennai
  { id:"12621", name:"Tamil Nadu Express",       from:"NDLS", to:"MAS",  dep:"22:30", arr:"07:10", dur:"32h 40m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:490,"2AC":1900,"3AC":1260},              totalSeats:{SL:500,"2AC":48,"3AC":64} },
  { id:"12433", name:"Rajdhani Express (CH)",    from:"NDLS", to:"MAS",  dep:"06:15", arr:"12:05", dur:"29h 50m", days:["Mon","Wed","Fri","Sat"],                   classes:["1AC","2AC","3AC"], fares:{SL:null,"1AC":4200,"2AC":2350,"3AC":1600}, totalSeats:{SL:0,"1AC":18,"2AC":48,"3AC":64} },

  // Mumbai ↔ Hyderabad
  { id:"17031", name:"Mumbai-Hyderabad Express", from:"MMCT", to:"SC",   dep:"05:50", arr:"23:25", dur:"17h 35m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:280,"2AC":1040,"3AC":700},               totalSeats:{SL:600,"2AC":48,"3AC":72} },
  { id:"12701", name:"Hussain Sagar Express",    from:"MMCT", to:"SC",   dep:"21:45", arr:"14:30", dur:"16h 45m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:265,"2AC":1000,"3AC":680},               totalSeats:{SL:580,"2AC":48,"3AC":64} },

  // Bangalore routes
  { id:"12627", name:"Karnataka Express",        from:"NDLS", to:"SBC",  dep:"22:30", arr:"06:05", dur:"31h 35m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:510,"2AC":1950,"3AC":1290},              totalSeats:{SL:500,"2AC":48,"3AC":64} },
  { id:"22691", name:"Rajdhani Express (BLR)",   from:"NDLS", to:"SBC",  dep:"20:30", arr:"04:00", dur:"31h 30m", days:["Tue","Thu","Sat"],                         classes:["1AC","2AC","3AC"], fares:{SL:null,"1AC":4500,"2AC":2500,"3AC":1700}, totalSeats:{SL:0,"1AC":18,"2AC":48,"3AC":64} },
  { id:"16535", name:"Gol Gumbaz Express",       from:"MMCT", to:"SBC",  dep:"20:45", arr:"07:15", dur:"34h 30m", days:["Mon","Thu","Sat","Sun"],                   classes:["SL","2AC","3AC"],  fares:{SL:430,"2AC":1640,"3AC":1090},              totalSeats:{SL:460,"2AC":48,"3AC":56} },

  // Kolkata ↔ Chennai
  { id:"12841", name:"Coromandel Express",       from:"HWH",  to:"MAS",  dep:"08:45", arr:"08:05", dur:"23h 20m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:400,"2AC":1540,"3AC":1030},              totalSeats:{SL:500,"2AC":48,"3AC":64} },
  { id:"12863", name:"Yesvantpur Howrah Express",from:"HWH",  to:"SBC",  dep:"23:00", arr:"04:00", dur:"29h 00m", days:["Mon","Wed","Fri","Sun"],                   classes:["SL","2AC","3AC"],  fares:{SL:440,"2AC":1680,"3AC":1120},              totalSeats:{SL:480,"2AC":48,"3AC":64} },

  // Short routes – popular pairs
  { id:"12649", name:"Karnataka Sampark Kranti", from:"NDLS", to:"YPR",  dep:"21:50", arr:"05:20", dur:"31h 30m", days:["Mon","Wed","Fri","Sat","Sun"],             classes:["SL","2AC","3AC"],  fares:{SL:500,"2AC":1930,"3AC":1280},              totalSeats:{SL:480,"2AC":48,"3AC":64} },
  { id:"12723", name:"Telangana Express",        from:"NDLS", to:"SC",   dep:"06:25", arr:"06:20", dur:"23h 55m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:430,"2AC":1650,"3AC":1100},              totalSeats:{SL:500,"2AC":48,"3AC":64} },
  { id:"12221", name:"Pune Rajdhani Express",    from:"NDLS", to:"PUNE", dep:"15:25", arr:"10:45", dur:"19h 20m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["1AC","2AC","3AC"], fares:{SL:null,"1AC":3600,"2AC":2050,"3AC":1400}, totalSeats:{SL:0,"1AC":18,"2AC":48,"3AC":64} },
  { id:"11301", name:"Udyan Express",            from:"MMCT", to:"SBC",  dep:"08:05", arr:"08:30", dur:"24h 25m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:400,"2AC":1560,"3AC":1040},              totalSeats:{SL:500,"2AC":48,"3AC":72} },
  { id:"12229", name:"Lucknow Mail",             from:"NDLS", to:"LKO",  dep:"22:00", arr:"06:00", dur:"8h 00m",  days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:150,"2AC":620,"3AC":415},                totalSeats:{SL:600,"2AC":48,"3AC":64} },
  { id:"12031", name:"Amritsar Shatabdi",        from:"NDLS", to:"ASR",  dep:"07:20", arr:"13:45", dur:"6h 25m",  days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["CC","EC"],         fares:{SL:null,CC:685,EC:1340},                    totalSeats:{SL:0,CC:400,EC:52} },
  { id:"12002", name:"Bhopal Shatabdi",          from:"NDLS", to:"BPL",  dep:"06:00", arr:"13:30", dur:"7h 30m",  days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["CC","EC"],         fares:{SL:null,CC:595,EC:1180},                    totalSeats:{SL:0,CC:380,EC:52} },
  { id:"22209", name:"Mumbai Duronto Express",   from:"MMCT", to:"NDLS", dep:"23:25", arr:"16:35", dur:"17h 10m", days:["Tue","Thu","Sat"],                         classes:["1AC","2AC","3AC"], fares:{SL:null,"1AC":3700,"2AC":2150,"3AC":1490}, totalSeats:{SL:0,"1AC":18,"2AC":48,"3AC":64} },
  { id:"12961", name:"Avantika Express",         from:"MMCT", to:"INDB", dep:"20:00", arr:"07:00", dur:"11h 00m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:220,"2AC":840,"3AC":565},                totalSeats:{SL:500,"2AC":48,"3AC":64} },
  { id:"12721", name:"Dakshin Express",          from:"NDLS", to:"HYB",  dep:"22:30", arr:"07:40", dur:"33h 10m", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["SL","2AC","3AC"],  fares:{SL:460,"2AC":1760,"3AC":1170},              totalSeats:{SL:500,"2AC":48,"3AC":64} },
  { id:"12025", name:"Pune Shatabdi Express",    from:"MMCT", to:"PUNE", dep:"06:25", arr:"10:50", dur:"4h 25m",  days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes:["CC","EC"],         fares:{SL:null,CC:395,EC:810},                     totalSeats:{SL:0,CC:350,EC:52} },
];

// Sorted copy for Binary Search (sort by train id)
const SORTED_TRAINS = [...TRAIN_DATA].sort((a,b)=>a.id.localeCompare(b.id));

// Station list & names
const STATIONS = {
  MMCT: "Mumbai (CSMT)",
  NDLS: "New Delhi",
  HWH:  "Kolkata (Howrah)",
  MAS:  "Chennai Central",
  SBC:  "Bangalore (KSR)",
  SC:   "Hyderabad (SC)",
  PUNE: "Pune Junction",
  LKO:  "Lucknow",
  ASR:  "Amritsar",
  BPL:  "Bhopal",
  INDB: "Indore",
  HYB:  "Hyderabad",
  YPR:  "Yesvantpur (BLR)",
};

// ─────────────────────────────────────────────
//  2. QUEUE CLASS (FIFO – Booking Requests)
// ─────────────────────────────────────────────
class BookingQueue {
  constructor() { this.items = []; }
  enqueue(item) { this.items.push(item); }
  dequeue()     { return this.items.length ? this.items.shift() : null; }
  peek()        { return this.items[0] || null; }
  isEmpty()     { return this.items.length === 0; }
  size()        { return this.items.length; }
  toArray()     { return [...this.items]; }
}

// ─────────────────────────────────────────────
//  3. LINKED LIST (True node-based WL)
// ─────────────────────────────────────────────
class ListNode {
  constructor(data) { this.data = data; this.next = null; }
}
class WaitingList {
  constructor() { this.head = null; this.size = 0; }

  append(data) {
    const node = new ListNode(data);
    if (!this.head) { this.head = node; }
    else {
      let cur = this.head;
      while (cur.next) cur = cur.next;
      cur.next = node;
    }
    this.size++;
    return node;
  }

  removeHead() {
    if (!this.head) return null;
    const data = this.head.data;
    this.head = this.head.next;
    this.size--;
    return data;
  }

  removeByPNR(pnr) {
    if (!this.head) return false;
    if (this.head.data.pnr === pnr) { this.removeHead(); return true; }
    let cur = this.head;
    while (cur.next) {
      if (cur.next.data.pnr === pnr) {
        cur.next = cur.next.next;
        this.size--;
        return true;
      }
      cur = cur.next;
    }
    return false;
  }

  toArray() {
    const arr = [];
    let cur = this.head;
    while (cur) { arr.push(cur.data); cur = cur.next; }
    return arr;
  }
}

// ─────────────────────────────────────────────
//  4. HASH MAP  (PNR → booking data)
// ─────────────────────────────────────────────
class PNRHashMap {
  constructor() { this.map = {}; this._counter = 1001; }

  generatePNR() { return "PNR" + (this._counter++); }

  set(pnr, data) { this.map[pnr] = data; }

  get(pnr) { return this.map[pnr] || null; }

  delete(pnr) { delete this.map[pnr]; }

  entries() { return Object.entries(this.map); }
}

// ─────────────────────────────────────────────
//  5. MERGE SORT  (sort bookings by journey date)
// ─────────────────────────────────────────────
function mergeSort(arr, key) {
  if (arr.length <= 1) return arr;
  const mid   = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid), key);
  const right = mergeSort(arr.slice(mid),    key);
  return merge(left, right, key);
}
function merge(L, R, key) {
  const result = [];
  let i = 0, j = 0;
  while (i < L.length && j < R.length) {
    if (L[i][key] <= R[j][key]) result.push(L[i++]);
    else                         result.push(R[j++]);
  }
  return result.concat(L.slice(i)).concat(R.slice(j));
}

// ─────────────────────────────────────────────
//  6. BINARY SEARCH on sorted train array
// ─────────────────────────────────────────────
function binarySearchTrainById(targetId) {
  let lo = 0, hi = SORTED_TRAINS.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (SORTED_TRAINS[mid].id === targetId) return SORTED_TRAINS[mid];
    else if (SORTED_TRAINS[mid].id < targetId) lo = mid + 1;
    else hi = mid - 1;
  }
  return null;
}

// ─────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────
const bookingQueue  = new BookingQueue();
const waitingList   = new WaitingList();
const pnrHashMap    = new PNRHashMap();
const confirmedList = [];  // array of booking objects
const cancelledPNRs = new Set();

// Per-train seat inventory  { trainId_classId_date : seatsLeft }
const seatInventory = {};

function inventoryKey(trainId, cls, date) { return `${trainId}__${cls}__${date}`; }

function getSeatsLeft(train, cls, date) {
  const key = inventoryKey(train.id, cls, date);
  if (seatInventory[key] === undefined) {
    seatInventory[key] = train.totalSeats[cls] || 0;
  }
  return seatInventory[key];
}

function decrementSeat(train, cls, date) {
  const key = inventoryKey(train.id, cls, date);
  if (seatInventory[key] === undefined) seatInventory[key] = train.totalSeats[cls] || 0;
  if (seatInventory[key] > 0) { seatInventory[key]--; return true; }
  return false;
}

function incrementSeat(train, cls, date) {
  const key = inventoryKey(train.id, cls, date);
  if (seatInventory[key] === undefined) seatInventory[key] = 0;
  seatInventory[key]++;
}

// ─────────────────────────────────────────────
//  NAVIGATION
// ─────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const navMap = { search:'Search Trains', mybookings:'My Bookings', pnr:'PNR Status', dsa:'🧠 DSA View' };
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.textContent.trim() === navMap[name]) b.classList.add('active');
  });
  if (name === 'mybookings') renderMyBookings();
  if (name === 'dsa')        renderDSAPanel();
}

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
function init() {
  const fromSel = document.getElementById('fromStation');
  const toSel   = document.getElementById('toStation');
  Object.entries(STATIONS).forEach(([code, name]) => {
    fromSel.innerHTML += `<option value="${code}">${name} (${code})</option>`;
    toSel.innerHTML   += `<option value="${code}">${name} (${code})</option>`;
  });

  // Default date = today
  const today = new Date();
  document.getElementById('journeyDate').value = today.toISOString().split('T')[0];
  document.getElementById('journeyDate').min   = today.toISOString().split('T')[0];

  // Default selections
  fromSel.value = 'MMCT';
  toSel.value   = 'NDLS';
}

// ─────────────────────────────────────────────
//  SWAP STATIONS
// ─────────────────────────────────────────────
function swapStations() {
  const f = document.getElementById('fromStation');
  const t = document.getElementById('toStation');
  [f.value, t.value] = [t.value, f.value];
}

// ─────────────────────────────────────────────
//  SEARCH TRAINS
// ─────────────────────────────────────────────
let currentSearchResult = { trains:[], from:'', to:'', date:'' };

function searchTrains() {
  const from = document.getElementById('fromStation').value;
  const to   = document.getElementById('toStation').value;
  const date = document.getElementById('journeyDate').value;

  if (!from) { showToast('Please select source station'); return; }
  if (!to)   { showToast('Please select destination station'); return; }
  if (from === to) { showToast('Source and destination cannot be same'); return; }

  // Filter by route
  let results = TRAIN_DATA.filter(t => t.from === from && t.to === to);

  // If no direct trains, show partial matches (from OR to match)
  if (results.length === 0) {
    results = TRAIN_DATA.filter(t => t.from === from || t.to === to);
  }
  // Still nothing? show all (never show empty)
  if (results.length === 0) {
    results = [...TRAIN_DATA].slice(0, 8);
  }

  // Sort by departure time (binary search idx lookup for already-sorted array)
  results.sort((a,b) => a.dep.localeCompare(b.dep));

  currentSearchResult = { trains: results, from, to, date };

  renderResults(results, from, to);
  document.getElementById('resultsSection').style.display = 'block';
  document.getElementById('resultsSection').scrollIntoView({ behavior:'smooth', block:'start' });
}

function renderResults(trains, from, to) {
  const fromName = STATIONS[from] || from;
  const toName   = STATIONS[to]   || to;
  document.getElementById('resultsTitle').textContent =
    `${trains.length} Train(s) found: ${fromName} → ${toName}`;

  const list = document.getElementById('trainList');
  list.innerHTML = trains.map(t => trainCard(t)).join('');
}

function trainCard(t) {
  const classBadges = t.classes.map(c => `<span class="class-badge class-${c}">${c}</span>`).join('');
  const days = t.days.map(d => `<span style="font-size:12px;margin-right:4px">${d}</span>`).join('');
  return `
  <div class="train-card">
    <div class="train-card-header">
      <div class="train-name-num">
        <span class="train-number">${t.id}</span>
        <span class="train-name">${t.name}</span>
      </div>
      <span class="running-days">🗓 ${days}</span>
    </div>
    <div class="train-card-body">
      <div class="station-info">
        <div class="time-big">${t.dep}</div>
        <div class="station-name">${STATIONS[t.from] || t.from}</div>
      </div>
      <div class="duration-box">
        <div class="duration-label">Duration</div>
        <span class="duration-arrow">────────▶</span>
        <div class="duration-value">${t.dur}</div>
      </div>
      <div class="station-info">
        <div class="time-big">${t.arr}</div>
        <div class="station-name">${STATIONS[t.to] || t.to}</div>
      </div>
      <div>
        <button class="btn btn-primary" onclick="openAvailability('${t.id}')">Check Availability</button>
      </div>
    </div>
    <div class="train-card-footer">
      <div class="class-badges">${classBadges}</div>
      <div style="font-size:13px;color:var(--text-mid)">
        Starts from <strong>₹${Math.min(...Object.values(t.fares).filter(f=>f!==null))}</strong>
      </div>
    </div>
  </div>`;
}

// ─────────────────────────────────────────────
//  RUSH BOOKING SIMULATION
// ─────────────────────────────────────────────
function rushBookingSimulate() {
  const date = document.getElementById('journeyDate').value || new Date().toISOString().split('T')[0];
  // Fill up seats on a few trains
  const targets = ['12951','12301','12621','11041'];
  targets.forEach(id => {
    const train = binarySearchTrainById(id);
    if (!train) return;
    train.classes.forEach(cls => {
      const key = inventoryKey(train.id, cls, date);
      if (seatInventory[key] === undefined) seatInventory[key] = train.totalSeats[cls] || 0;
      // Simulate heavy booking – leave 2-5 seats
      const leave = Math.floor(Math.random() * 4) + 2;
      seatInventory[key] = Math.max(leave, 0);
    });
  });
  showToast('⚡ Rush booking simulated! Seats nearly full on select trains.');
  renderDSAPanel();
}

// ─────────────────────────────────────────────
//  AVAILABILITY PAGE
// ─────────────────────────────────────────────
let currentTrain = null;
let selectedAvailDate = '';
let selectedClass = '';

function openAvailability(trainId) {
  currentTrain = binarySearchTrainById(trainId); // Binary search used here
  if (!currentTrain) { showToast('Train not found'); return; }

  const baseDate = new Date();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  selectedAvailDate = currentSearchResult.date || dates[0];
  renderAvailabilityPage(currentTrain, dates);
  showPage('availability');
}

function renderAvailabilityPage(train, dates) {
  const cont = document.getElementById('availabilityContent');

  const dateTabs = dates.map(d => {
    const label = formatDate(d);
    const active = d === selectedAvailDate ? 'active' : '';
    return `<button class="date-tab ${active}" onclick="selectDate('${d}')">${label}</button>`;
  }).join('');

  cont.innerHTML = `
    <div class="avail-train-info">
      <div class="avail-title">🚆 ${train.id} — ${train.name}</div>
      <div style="font-size:14px;color:var(--text-mid)">
        <strong>${STATIONS[train.from]||train.from}</strong>
        ${train.dep} → ${train.arr}
        <strong>${STATIONS[train.to]||train.to}</strong>
        &nbsp;·&nbsp; ${train.dur}
      </div>
    </div>
    <div class="avail-section-title">Select Journey Date</div>
    <div class="avail-date-tabs" id="dateTabs">${dateTabs}</div>
    <div class="avail-section-title">Class Availability</div>
    <div class="avail-classes-grid" id="classGrid"></div>
  `;

  renderClassGrid(train, selectedAvailDate);
}

function selectDate(date) {
  selectedAvailDate = date;
  document.querySelectorAll('.date-tab').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === formatDate(date));
  });
  renderClassGrid(currentTrain, date);
}

function renderClassGrid(train, date) {
  const grid = document.getElementById('classGrid');
  if (!grid) return;

  const rows = train.classes.map(cls => {
    const fare = train.fares[cls];
    if (!fare) return '';
    const seats    = getSeatsLeft(train, cls, date);
    const total    = train.totalSeats[cls] || 0;
    const pct      = total > 0 ? seats / total : 0;

    let statusHtml, probHtml;
    if (seats > 10) {
      statusHtml = `<span class="status-badge status-available">✔ Available</span>`;
      probHtml   = `<span class="prob-badge prob-high">High Probability</span>`;
    } else if (seats > 0) {
      statusHtml = `<span class="status-badge status-limited">⚠ Limited (${seats} left)</span>`;
      probHtml   = `<span class="prob-badge prob-medium">Medium Probability</span>`;
    } else {
      statusHtml = `<span class="status-badge status-waitlist">❌ Waiting List</span>`;
      probHtml   = `<span class="prob-badge prob-low">Low Probability</span>`;
    }

    const bookBtnStyle = seats > 0
      ? 'btn-green' : 'btn-red';
    const bookBtnText  = seats > 0 ? '🎟 Book Now' : '📋 Join Waiting List';

    return `
    <div class="avail-class-row">
      <div>
        <div class="avail-class-name">${cls}</div>
        <div class="avail-fare">Fare: <strong>₹${fare}</strong></div>
      </div>
      <div class="avail-seats-info">
        <div class="seats-count" style="color:${seats>10?'var(--green)':seats>0?'var(--yellow)':'var(--red)'}">${seats}</div>
        <div class="seats-label">seats left</div>
      </div>
      ${statusHtml}
      ${probHtml}
      <button class="btn ${bookBtnStyle}" onclick="openBookingForm('${train.id}','${cls}','${date}')">
        ${bookBtnText}
      </button>
    </div>`;
  }).join('');

  grid.innerHTML = rows || '<div class="empty-state">No classes available</div>';
}

// ─────────────────────────────────────────────
//  BOOKING FORM
// ─────────────────────────────────────────────
let bookingState = { trainId:'', cls:'', date:'', passengers:[] };
let passengerCount = 1;

function openBookingForm(trainId, cls, date) {
  bookingState = { trainId, cls, date, passengers:[] };
  passengerCount = 1;
  const train = binarySearchTrainById(trainId);
  const fare  = train.fares[cls];
  const seatsLeft = getSeatsLeft(train, cls, date);

  const cont = document.getElementById('bookingFormContent');
  cont.innerHTML = `
    <div class="booking-card">
      <div class="booking-title">Passenger Details</div>
      <div class="booking-summary-mini">
        🚆 <strong>${train.id}</strong> ${train.name} &nbsp;|&nbsp;
        ${STATIONS[train.from]||train.from} → ${STATIONS[train.to]||train.to} &nbsp;|&nbsp;
        <strong>${cls}</strong> &nbsp;|&nbsp;
        ${formatDate(date)} &nbsp;|&nbsp;
        Fare: ₹${fare}/person &nbsp;|&nbsp;
        <strong style="color:${seatsLeft>0?'var(--green)':'var(--red)'}">${seatsLeft > 0 ? seatsLeft+' seats left' : 'Waiting List'}</strong>
      </div>
      <div id="passengersContainer">
        ${passengerFormHTML(1)}
      </div>
      <button id="addPassengerBtn" onclick="addPassengerForm()">+ Add Another Passenger (max 6)</button>
      <div class="divider"></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary btn-large" onclick="submitBooking()">Confirm Booking</button>
        <button class="btn btn-outline" onclick="showPage('availability')">Back</button>
      </div>
    </div>
  `;
  showPage('booking');
}

function passengerFormHTML(num) {
  return `
  <div class="passenger-row" id="pax_${num}">
    <div class="passenger-row-title">Passenger ${num}</div>
    <div class="passenger-form-grid">
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" id="pax_name_${num}" placeholder="As per ID card"/>
      </div>
      <div class="form-group">
        <label>Age</label>
        <input type="number" id="pax_age_${num}" placeholder="Age" min="1" max="120"/>
      </div>
      <div class="form-group">
        <label>Gender</label>
        <select id="pax_gender_${num}">
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>
      </div>
    </div>
  </div>`;
}

function addPassengerForm() {
  if (passengerCount >= 6) { showToast('Maximum 6 passengers allowed'); return; }
  passengerCount++;
  const cont = document.getElementById('passengersContainer');
  cont.insertAdjacentHTML('beforeend', passengerFormHTML(passengerCount));
}

function submitBooking() {
  const passengers = [];
  for (let i = 1; i <= passengerCount; i++) {
    const name   = document.getElementById(`pax_name_${i}`)?.value.trim();
    const age    = document.getElementById(`pax_age_${i}`)?.value;
    const gender = document.getElementById(`pax_gender_${i}`)?.value;
    if (!name)  { showToast(`Enter name for passenger ${i}`); return; }
    if (!age)   { showToast(`Enter age for passenger ${i}`); return; }
    passengers.push({ name, age, gender });
  }

  const train    = binarySearchTrainById(bookingState.trainId);
  const { cls, date } = bookingState;
  const fare     = train.fares[cls];

  // Enqueue booking request
  const request = {
    trainId: train.id,
    trainName: train.name,
    cls, date,
    fare,
    passengers,
    requestedAt: new Date().toISOString()
  };
  bookingQueue.enqueue(request);
  renderDSAPanel();

  // Process queue (FIFO)
  processBookingQueue(train);
}

function processBookingQueue(train) {
  while (!bookingQueue.isEmpty()) {
    const req = bookingQueue.dequeue();
    const seatsNeeded = req.passengers.length;
    const t = binarySearchTrainById(req.trainId);

    // Try to confirm all passengers together
    const seatsLeft = getSeatsLeft(t, req.cls, req.date);

    if (seatsLeft >= seatsNeeded) {
      // Confirm booking
      for (let i = 0; i < seatsNeeded; i++) decrementSeat(t, req.cls, req.date);
      const pnr = pnrHashMap.generatePNR();
      const seatNum = `${req.cls}-${Math.floor(Math.random()*90)+1}`;
      const booking = {
        pnr,
        ...req,
        status: 'CONFIRMED',
        seatNumber: seatNum,
        totalFare: req.fare * seatsNeeded,
        bookedAt: new Date().toISOString()
      };
      confirmedList.push(booking);
      pnrHashMap.set(pnr, booking);
      showConfirmPopup(booking, false);
    } else {
      // Add to waiting list
      const pnr = pnrHashMap.generatePNR();
      const wlNum = waitingList.size + 1;
      const booking = {
        pnr,
        ...req,
        status: 'WAITING',
        wlNumber: wlNum,
        totalFare: req.fare * seatsNeeded,
        bookedAt: new Date().toISOString()
      };
      waitingList.append(booking);
      confirmedList.push(booking);
      pnrHashMap.set(pnr, booking);
      showConfirmPopup(booking, true);
    }
  }
  renderDSAPanel();
}

// ─────────────────────────────────────────────
//  CONFIRM POPUP
// ─────────────────────────────────────────────
function showConfirmPopup(booking, isWaiting) {
  const icon  = isWaiting ? '⚠️' : '✅';
  const title = isWaiting ? 'Added to Waiting List' : 'Booking Confirmed!';
  const titleClass = isWaiting ? 'confirm-wl-title' : '';
  const paxNames = booking.passengers.map(p=>p.name).join(', ');

  const rows = [
    ['PNR Number',    booking.pnr],
    ['Train',         `${booking.trainId} – ${booking.trainName}`],
    ['Route',         `${STATIONS[binarySearchTrainById(booking.trainId)?.from||'']||''} → ${STATIONS[binarySearchTrainById(booking.trainId)?.to||'']||''}`],
    ['Date',          formatDate(booking.date)],
    ['Class',         booking.cls],
    ['Passengers',    paxNames],
    ['Status',        isWaiting ? `WL/${booking.wlNumber}` : `Confirmed – Seat ${booking.seatNumber}`],
    ['Total Fare',    `₹${booking.totalFare}`],
  ];

  const tableHtml = rows.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('');
  document.getElementById('popupContent').innerHTML = `
    <div class="confirm-icon">${icon}</div>
    <div class="confirm-title ${titleClass}">${title}</div>
    <table class="confirm-table">${tableHtml}</table>
  `;
  document.getElementById('popupOverlay').classList.add('show');
}

function closePopup() {
  document.getElementById('popupOverlay').classList.remove('show');
}

// ─────────────────────────────────────────────
//  MY BOOKINGS  (Merge Sort)
// ─────────────────────────────────────────────
function renderMyBookings() {
  const list = document.getElementById('bookingsList');

  if (confirmedList.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-state-icon">🎫</div>
      <div class="empty-state-text">No bookings yet. Search trains to get started!</div>
    </div>`;
    return;
  }

  // Merge Sort by date
  const sorted = mergeSort([...confirmedList], 'date');

  list.innerHTML = sorted.map(b => {
    const isConfirmed = b.status === 'CONFIRMED';
    const statusHtml = isConfirmed
      ? `<span class="booking-status-confirmed">✔ CONFIRMED</span>`
      : `<span class="booking-status-waiting">⚠ WL/${b.wlNumber}</span>`;
    const paxNames = b.passengers.map(p=>p.name).join(', ');
    const trainObj = binarySearchTrainById(b.trainId);
    const route = trainObj
      ? `${STATIONS[trainObj.from]||trainObj.from} → ${STATIONS[trainObj.to]||trainObj.to}`
      : '';

    return `
    <div class="booking-item">
      <div class="booking-item-header">
        <div class="booking-pnr">PNR: ${b.pnr}</div>
        ${statusHtml}
      </div>
      <div class="booking-item-body">
        <div class="booking-field">
          <div class="booking-field-label">Train</div>
          <div class="booking-field-val">${b.trainId} ${b.trainName}</div>
        </div>
        <div class="booking-field">
          <div class="booking-field-label">Route</div>
          <div class="booking-field-val">${route}</div>
        </div>
        <div class="booking-field">
          <div class="booking-field-label">Date</div>
          <div class="booking-field-val">${formatDate(b.date)}</div>
        </div>
        <div class="booking-field">
          <div class="booking-field-label">Class</div>
          <div class="booking-field-val">${b.cls}</div>
        </div>
        <div class="booking-field">
          <div class="booking-field-label">Passengers</div>
          <div class="booking-field-val">${paxNames}</div>
        </div>
        <div class="booking-field">
          <div class="booking-field-label">Seat/WL</div>
          <div class="booking-field-val">${isConfirmed ? b.seatNumber : 'WL/'+b.wlNumber}</div>
        </div>
        <div class="booking-field">
          <div class="booking-field-label">Total Fare</div>
          <div class="booking-field-val">₹${b.totalFare}</div>
        </div>
      </div>
      <div class="booking-item-footer">
        <button class="btn btn-red" onclick="cancelBooking('${b.pnr}')">✕ Cancel</button>
      </div>
    </div>`;
  }).join('');
}

// ─────────────────────────────────────────────
//  CANCEL BOOKING
// ─────────────────────────────────────────────
function cancelBooking(pnr) {
  const booking = pnrHashMap.get(pnr);
  if (!booking) { showToast('Booking not found'); return; }
  if (cancelledPNRs.has(pnr)) { showToast('Already cancelled'); return; }

  cancelledPNRs.add(pnr);

  // Remove from confirmedList
  const idx = confirmedList.findIndex(b => b.pnr === pnr);
  if (idx !== -1) confirmedList.splice(idx, 1);

  if (booking.status === 'CONFIRMED') {
    // Return seat
    const train = binarySearchTrainById(booking.trainId);
    if (train) incrementSeat(train, booking.cls, booking.date);

    // Promote first waiting list passenger
    const wlPassenger = waitingList.head?.data;
    if (wlPassenger && wlPassenger.cls === booking.cls &&
        wlPassenger.trainId === booking.trainId &&
        wlPassenger.date === booking.date) {
      const promoted = waitingList.removeHead();
      if (promoted) {
        decrementSeat(train, promoted.cls, promoted.date);
        promoted.status = 'CONFIRMED';
        promoted.seatNumber = `${promoted.cls}-${Math.floor(Math.random()*90)+1}`;
        delete promoted.wlNumber;
        // Update in pnr map
        pnrHashMap.set(promoted.pnr, promoted);
        // Update in confirmed list if still there
        const cidx = confirmedList.findIndex(b=>b.pnr===promoted.pnr);
        if (cidx !== -1) confirmedList[cidx] = promoted;
        showToast(`✅ WL passenger ${promoted.passengers[0].name} promoted to Confirmed!`);
      }
    }
  } else if (booking.status === 'WAITING') {
    waitingList.removeByPNR(pnr);
  }

  pnrHashMap.delete(pnr);
  showToast(`Booking ${pnr} cancelled.`);
  renderMyBookings();
  renderDSAPanel();
}

// ─────────────────────────────────────────────
//  PNR CHECK
// ─────────────────────────────────────────────
function checkPNR() {
  const pnr = document.getElementById('pnrInput').value.trim().toUpperCase();
  const res = document.getElementById('pnrResult');

  if (!pnr) { showToast('Enter PNR number'); return; }

  const booking = pnrHashMap.get(pnr);  // O(1) hash lookup

  if (!booking) {
    res.innerHTML = `<div class="pnr-result-card" style="border-color:var(--red)">
      <div style="color:var(--red);font-size:18px;font-weight:700;">❌ PNR Not Found</div>
      <div style="color:var(--text-mid);margin-top:8px">No booking found for PNR <strong>${pnr}</strong></div>
    </div>`;
    return;
  }

  const trainObj = binarySearchTrainById(booking.trainId);
  const paxHtml = booking.passengers.map((p,i) =>
    `<tr><td>Passenger ${i+1}</td><td>${p.name}, Age ${p.age}, ${p.gender==='M'?'Male':p.gender==='F'?'Female':'Other'}</td></tr>`
  ).join('');
  const statusColor = booking.status==='CONFIRMED' ? 'var(--green)' : 'var(--yellow)';
  const statusText  = booking.status==='CONFIRMED' ? `✔ Confirmed – Seat ${booking.seatNumber}` : `⚠ Waiting List – WL/${booking.wlNumber}`;

  res.innerHTML = `<div class="pnr-result-card">
    <div class="pnr-result-title">✅ PNR Found</div>
    <table class="confirm-table">
      <tr><td>PNR</td><td>${booking.pnr}</td></tr>
      <tr><td>Train</td><td>${booking.trainId} – ${booking.trainName}</td></tr>
      <tr><td>Route</td><td>${STATIONS[trainObj?.from||'']||''} → ${STATIONS[trainObj?.to||'']||''}</td></tr>
      <tr><td>Date</td><td>${formatDate(booking.date)}</td></tr>
      <tr><td>Class</td><td>${booking.cls}</td></tr>
      ${paxHtml}
      <tr><td>Status</td><td style="color:${statusColor};font-weight:700">${statusText}</td></tr>
      <tr><td>Total Fare</td><td>₹${booking.totalFare}</td></tr>
    </table>
  </div>`;
}

// ─────────────────────────────────────────────
//  DSA VISUALIZATION PANEL
// ─────────────────────────────────────────────
function renderDSAPanel() {
  // 1. Array panel – show first 10 sorted trains
  const arrDiv = document.getElementById('dsaArray');
  if (arrDiv) {
    const nodes = SORTED_TRAINS.slice(0, 10).map(t =>
      `<span class="dsa-node" title="${t.name}">${t.id}</span>`
    ).join('<span class="dsa-arrow">→</span>');
    arrDiv.innerHTML = `
      <div style="margin-bottom:8px">${nodes}</div>
      <div style="color:var(--text-light);font-size:12px">Total trains: ${SORTED_TRAINS.length} | Sorted by train ID for Binary Search</div>
      <div style="margin-top:10px;font-size:12px;color:var(--text-mid)">
        <strong>Binary Search</strong> – Last lookup O(log n):
        e.g. Search "12951" in ${SORTED_TRAINS.length} elements = ${Math.ceil(Math.log2(SORTED_TRAINS.length))} comparisons max
      </div>`;
  }

  // 2. Queue panel
  const qDiv = document.getElementById('dsaQueue');
  if (qDiv) {
    const qItems = bookingQueue.toArray();
    if (qItems.length === 0) {
      qDiv.innerHTML = `<div class="dsa-empty">Queue is empty (no pending requests)</div>`;
    } else {
      const nodes = qItems.map(req =>
        `<span class="dsa-node queue-node" title="${req.passengers[0].name}">${req.pnr||'?'} (${req.cls})</span>`
      ).join('<span class="dsa-arrow">→</span>');
      qDiv.innerHTML = `<div style="margin-bottom:6px">
        <span style="font-size:11px;color:var(--text-light)">HEAD (dequeue)</span> ${nodes}
        <span style="font-size:11px;color:var(--text-light)">TAIL (enqueue)</span>
      </div>`;
    }
    qDiv.innerHTML += `<div style="font-size:12px;color:var(--text-mid);margin-top:8px">Items in queue: <strong>${qItems.length}</strong></div>`;
  }

  // 3. Linked List panel
  const llDiv = document.getElementById('dsaLinkedList');
  if (llDiv) {
    const wlItems = waitingList.toArray();
    if (wlItems.length === 0) {
      llDiv.innerHTML = `<div class="dsa-empty">Waiting list is empty</div>`;
    } else {
      let html = `<div class="dsa-ll-row">`;
      wlItems.forEach((item, i) => {
        html += `<span class="dsa-node ll-node" title="${item.passengers[0].name} – ${item.cls}">${item.pnr}<br><small>WL${item.wlNumber||i+1}</small></span>`;
        if (i < wlItems.length - 1) html += `<span class="dsa-arrow">→</span>`;
      });
      html += `<span class="dsa-arrow">→ NULL</span></div>`;
      llDiv.innerHTML = html;
    }
    llDiv.innerHTML += `<div style="font-size:12px;color:var(--text-mid);margin-top:8px">
      Waiting list size: <strong>${waitingList.size}</strong> | Cancellation promotes HEAD node
    </div>`;
  }

  // 4. Hash Map panel
  const hmDiv = document.getElementById('dsaHashMap');
  if (hmDiv) {
    const entries = pnrHashMap.entries();
    if (entries.length === 0) {
      hmDiv.innerHTML = `<div class="dsa-empty">Hash map is empty (no PNRs stored)</div>`;
    } else {
      const rows = entries.slice(-8).map(([k,v]) =>
        `<div class="dsa-hash-row">
          <span class="hash-key">${k}</span>
          <span class="hash-arrow">→</span>
          <span class="hash-val">${v.trainId} · ${v.cls} · ${v.passengers[0].name} · <strong style="color:${v.status==='CONFIRMED'?'var(--green)':'var(--yellow)'}">${v.status}</strong></span>
        </div>`
      ).join('');
      hmDiv.innerHTML = rows;
      if (entries.length > 8) {
        hmDiv.innerHTML += `<div style="font-size:12px;color:var(--text-light);padding-top:6px">... and ${entries.length-8} more entries</div>`;
      }
    }
    hmDiv.innerHTML += `<div style="font-size:12px;color:var(--text-mid);margin-top:8px">
      Total PNRs stored: <strong>${entries.length}</strong> | Lookup: O(1)
    </div>`;
  }
}

// ─────────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday:'short', day:'2-digit', month:'short' });
}

// ─────────────────────────────────────────────
//  BOOTSTRAP
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  init();
  renderDSAPanel();
});

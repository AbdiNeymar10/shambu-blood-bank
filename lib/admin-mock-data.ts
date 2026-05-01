export const summaryStats = {
  totalDonors: 1248,
  pendingRequests: 14,
  availableBloodUnits: 342,
  activeCampaigns: 3,
};

export const bloodStockData = [
  { group: "A+", units: 65 },
  { group: "A-", units: 15 },
  { group: "B+", units: 80 },
  { group: "B-", units: 12 },
  { group: "AB+", units: 25 },
  { group: "AB-", units: 5 },
  { group: "O+", units: 110 },
  { group: "O-", units: 30 },
];

export const donationTrends = [
  { month: "Jan", donations: 120 },
  { month: "Feb", donations: 132 },
  { month: "Mar", donations: 101 },
  { month: "Apr", donations: 145 },
  { month: "May", donations: 160 },
  { month: "Jun", donations: 155 },
];

export const recentRequests = [
  {
    id: "REQ-001",
    patientName: "Abebe Kebede",
    bloodGroup: "O-",
    units: 2,
    hospital: "Black Lion Hospital",
    priority: "Critical",
    status: "Pending",
    date: "2026-05-01",
  },
  {
    id: "REQ-002",
    patientName: "Tigist Bekele",
    bloodGroup: "A+",
    units: 1,
    hospital: "Zewditu Hospital",
    priority: "Normal",
    status: "Approved",
    date: "2026-05-01",
  },
  {
    id: "REQ-003",
    patientName: "Dawit Alemu",
    bloodGroup: "B+",
    units: 3,
    hospital: "St. Paul's Hospital",
    priority: "Urgent",
    status: "Pending",
    date: "2026-04-30",
  },
  {
    id: "REQ-004",
    patientName: "Sara Tesfaye",
    bloodGroup: "AB+",
    units: 1,
    hospital: "Yekatit 12 Hospital",
    priority: "Normal",
    status: "Fulfilled",
    date: "2026-04-29",
  },
];

export const emergencyAlerts = [
  {
    id: "ALERT-01",
    type: "Critical Shortage",
    bloodGroup: "O-",
    message: "O- blood stock is critically low (under 10 units). Immediate outreach required.",
    timestamp: "2 hours ago"
  },
  {
    id: "ALERT-02",
    type: "High Demand",
    bloodGroup: "A+",
    message: "Multiple urgent requests received for A+ blood in the last 24 hours.",
    timestamp: "5 hours ago"
  }
];

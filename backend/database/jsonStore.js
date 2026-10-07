const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'applications.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const defaultApps = [
      {
        id: "app-001",
        job_id: "adz-in-001",
        title: "Senior Full Stack Engineer",
        company: "Swiggy",
        location: "Bengaluru, India",
        stage: "Interviewing",
        source_url: "https://careers.swiggy.com/",
        source_name: "Adzuna Demo / Swiggy Careers",
        salary: "₹24,00,000 / year",
        applied_date: "2026-09-28",
        notes: "Completed technical round 1 on system design. Next HR interview scheduled.",
        updated_at: new Date().toISOString()
      },
      {
        id: "app-002",
        job_id: "adz-in-003",
        title: "Frontend Lead Engineer",
        company: "Razorpay",
        location: "Bengaluru, India",
        stage: "Applied",
        source_url: "https://razorpay.com/jobs/",
        source_name: "Adzuna Demo / Razorpay Careers",
        salary: "₹28,00,000 / year",
        applied_date: "2026-10-02",
        notes: "Submitted application via official portal with updated portfolio.",
        updated_at: new Date().toISOString()
      },
      {
        id: "app-003",
        job_id: "adz-in-004",
        title: "Data Engineer",
        company: "Zomato",
        location: "Gurugram, India",
        stage: "Offer",
        source_url: "https://www.zomato.com/careers",
        source_name: "Adzuna Demo / Zomato Careers",
        salary: "₹22,00,000 / year",
        applied_date: "2026-09-15",
        notes: "Received formal offer letter. Negotiating joining bonus.",
        updated_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultApps, null, 2), 'utf-8');
  }
}

function loadApplications() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading applications file:', err);
    return [];
  }
}

function saveApplications(apps) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf-8');
}

module.exports = {
  loadApplications,
  saveApplications,
  ensureDataFile
};

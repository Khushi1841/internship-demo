const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Setup Uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Setup SQLite Database
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to SQLite Database.");
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT,
      password TEXT,
      otp TEXT,
      is_verified INTEGER DEFAULT 0,
      course TEXT,
      university TEXT,
      graduation_year TEXT,
      location TEXT,
      skills TEXT,
      resume_path TEXT
    )`);
  }
});

// Setup Nodemailer
let transporter;

if (process.env.GMAIL_USER && process.env.GMAIL_USER !== 'your-email@gmail.com') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
  console.log("Real Gmail Service Ready. Emails will be sent from:", process.env.GMAIL_USER);
} else {
  // Fallback to Ethereal Email for testing if no Gmail is provided
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return;
    }
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });
    console.log("Test Email Service Ready. Please configure .env for real emails.");
  });
}

// API Routes

// 1. Direct Login (No OTP)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Account not found. Please sign up." });
    if (row.password !== password) return res.status(401).json({ error: "Incorrect password." });
    
    // Check if they ever verified their OTP during signup
    if (row.is_verified === 0) {
      return res.status(403).json({ error: "Account not verified. Please sign up again to verify OTP." });
    }
    
    res.json({ success: true, user: row });
  });
});

// 2. Request OTP (Only for Signup)
app.post('/api/auth/request-otp', (req, res) => {
  const { email, name, password } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  if (!password) return res.status(400).json({ error: "Password is required" });

  const isLogin = false; // We only use this route for signup now
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4 digit OTP

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row && row.is_verified === 1) {
      return res.status(400).json({ error: "Account already exists and is verified. Please log in." });
    }
    
    const sendEmail = () => {
      const mailOptions = {
        from: '"Internship App" <no-reply@internship.app>',
        to: email,
        subject: "Your OTP Verification Code",
        text: `Your OTP for the internship app is: ${otp}`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email send error:", error);
          return res.status(500).json({ error: "Failed to send email. Check your Gmail App Password." });
        }
        
        let previewUrl = null;
        if (!process.env.GMAIL_USER || process.env.GMAIL_USER === 'your-email@gmail.com') {
          previewUrl = nodemailer.getTestMessageUrl(info);
          console.log("Preview URL: %s", previewUrl);
        } else {
          console.log("Real email sent to", email);
        }

        res.json({ 
          success: true, 
          message: "OTP sent successfully",
          previewUrl 
        });
      });
    };

    if (row) {
      // Update unverified user
      db.run("UPDATE users SET password = ?, otp = ?, name = ? WHERE email = ?", [password, otp, name, email], sendEmail);
    } else {
      // Insert new user
      db.run("INSERT INTO users (email, name, password, otp) VALUES (?, ?, ?, ?)", [email, name, password, otp], sendEmail);
    }
  });
});

// 3. Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "User not found" });
    
    if (row.otp === otp) {
      db.run("UPDATE users SET is_verified = 1 WHERE email = ?", [email], () => {
        res.json({ success: true, user: { ...row, is_verified: 1 } });
      });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  });
});

// 4. Save User Details
app.post('/api/users/details', (req, res) => {
  const { email, course, university, graduationYear, location, skills } = req.body;
  
  db.run(`UPDATE users SET 
    course = ?, 
    university = ?, 
    graduation_year = ?, 
    location = ?, 
    skills = ? 
    WHERE email = ?`, 
    [course, university, graduationYear, location, skills, email], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// 5. Upload Resume
app.post('/api/users/resume', upload.single('resume'), async (req, res) => {
  const email = req.body.email;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  let parsedData = {};

  try {
    let text = "";
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const parseFunction = pdf.PDFParse || pdf;
      const data = await parseFunction(dataBuffer);
      text = data.text;
    } else if (req.file.originalname.toLowerCase().endsWith('.docx') || req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({path: req.file.path});
      text = result.value;
    }

    if (text) {
      const cleanText = text.replace(/\n/g, ' ');
      
      console.log("Parsed PDF Text Length:", cleanText.length);
      
      // More robust Heuristic Parsing
      const courseMatch = cleanText.match(/\b(B\.?Tech|B\.?Sc|B\.?E\b|M\.?Tech|BCA|MCA|BBA|MBA|Bachelor|Master)(?:\s+(?:of|in)\s+[A-Za-z]+(?:\s+[A-Za-z]+){0,3})?/i);
      if (courseMatch) parsedData.course = courseMatch[0].trim();
      
      const uniMatch = cleanText.match(/(?:[A-Za-z]+\s+){1,4}(?:University|College|Institute|School)\b/i);
      if (uniMatch) parsedData.university = uniMatch[0].trim();
      
      const yearMatch = cleanText.match(/\b(201[0-9]|202[0-9]|203[0-5])\b/);
      if (yearMatch) parsedData.graduationYear = yearMatch[0];
      
      const skillKeywords = ["JavaScript", "Python", "React", "Node", "Java", "C\\+\\+", "C", "SQL", "MongoDB", "Express", "HTML", "CSS", "AWS", "Docker", "Git", "Next.js", "TypeScript"];
      const foundSkills = skillKeywords.filter(skill => new RegExp(`\\b${skill}\\b`, 'i').test(text));
      if (foundSkills.length > 0) parsedData.skills = foundSkills.join(", ").replace(/C\+\+/g, 'C++');
      
      const locMatch = cleanText.match(/\b(Bangalore|Bengaluru|Mumbai|Delhi|New Delhi|Hyderabad|Chennai|Pune|Noida|Gurgaon|Kolkata|Ahmedabad|Jaipur|Chandigarh|Indore)\b/i);
      if (locMatch) parsedData.location = locMatch[0];
    }
  } catch (error) {
    console.error("File Parsing error:", error);
  }

  db.run("UPDATE users SET resume_path = ? WHERE email = ?", [req.file.filename, email], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, filename: req.file.filename, parsedData });
  });
});

// 6. Admin: Get all users
app.get('/api/admin/users', (req, res) => {
  db.all("SELECT id, email, name, course, university, graduation_year, location, skills, resume_path, is_verified FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 7. Serve static files for resume downloads
app.use('/uploads', express.static(uploadsDir));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

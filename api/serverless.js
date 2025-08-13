const express = require('express');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Basic API routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Anand Pinisetty Portfolio API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

app.get("/api/portfolio", (req, res) => {
  res.json({
    name: "Anand Pinisetty",
    title: "Entrepreneur, Founder & CEO, Developer",
    location: "Kakinada, Andhra Pradesh, India",
    email: "anandpinisetty@gmail.com"
  });
});

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  
  res.json({
    success: true,
    message: "Thank you for your message! I'll get back to you soon.",
    data: { name, email, subject, message }
  });
});

// Export for Vercel
module.exports = app;

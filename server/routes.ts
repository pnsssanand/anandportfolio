import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "Anand Pinisetty Portfolio API is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  // Get portfolio info endpoint
  app.get("/api/portfolio", (req, res) => {
    res.json({
      name: "Anand Pinisetty",
      title: "Entrepreneur, Founder & CEO, Developer",
      location: "Kakinada, Andhra Pradesh, India",
      email: "anandpinisetty@gmail.com"
    });
  });

  // Contact form endpoint (placeholder)
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // TODO: Implement actual contact form handling
    // For now, just return success
    res.json({
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
      data: { name, email, subject, message }
    });
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}

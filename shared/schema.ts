import { z } from "zod";

// Project Schema
export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  media: z.string().url().optional(),
  link: z.string().url().optional(),
  featured: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Contact Message Schema
export const contactMessageSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
  status: z.enum(['new', 'read', 'replied']).default('new'),
  createdAt: z.date(),
});

export const insertContactMessageSchema = contactMessageSchema.omit({
  id: true,
  status: true,
  createdAt: true,
});

// Profile Schema
export const profileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  title: z.string(),
  bio: z.string(),
  email: z.string().email(),
  location: z.string(),
  profileImage: z.string().url().optional(),
  linkedIn: z.string().url().optional(),
  github: z.string().url().optional(),
  updatedAt: z.date(),
});

export const updateProfileSchema = profileSchema.omit({
  id: true,
  updatedAt: true,
}).partial();

// Skills Schema
export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['technical', 'professional']),
  proficiency: z.number().min(0).max(100),
  icon: z.string().optional(),
});

export const insertSkillSchema = skillSchema.omit({
  id: true,
});

// Education Schema
export const educationSchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  specialization: z.string().optional(),
  duration: z.string(),
  subjects: z.array(z.string()).optional(),
  current: z.boolean().default(false),
});

export const insertEducationSchema = educationSchema.omit({
  id: true,
});

// Analytics Schema
export const analyticsSchema = z.object({
  id: z.string(),
  pageViews: z.number().default(0),
  projectViews: z.number().default(0),
  contactMessages: z.number().default(0),
  downloads: z.number().default(0),
  lastUpdated: z.date(),
});

// User Schema (for admin authentication)
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.enum(['admin']).default('admin'),
  createdAt: z.date(),
});

export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
});

// Client Schema
export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string().optional(),
  project: z.string().optional(),
  email: z.string().email().optional(),
  createdAt: z.date(),
});

export const insertClientSchema = clientSchema.omit({
  id: true,
  createdAt: true,
});

// Type exports
export type Project = z.infer<typeof projectSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ContactMessage = z.infer<typeof contactMessageSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Education = z.infer<typeof educationSchema>;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Analytics = z.infer<typeof analyticsSchema>;
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Client = z.infer<typeof clientSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;

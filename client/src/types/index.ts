export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface CloudinaryUploadOptions {
  upload_preset: string;
  cloud_name: string;
  folder?: string;
  public_id?: string;
  transformation?: string[];
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface SkillItemProps {
  name: string;
  proficiency: number;
  category: 'technical' | 'professional';
  icon?: string;
}

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  media?: string;
  link?: string;
  featured?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export interface EducationTimelineProps {
  id: string;
  degree: string;
  institution: string;
  specialization?: string;
  duration: string;
  subjects?: string[];
  current: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdminTabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface StatsCardProps {
  icon: string;
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
}

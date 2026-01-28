import { Models } from "appwrite";

/**
 * Appwrite Collection Schema Documentation
 *
 * PROJECTS Collection (projects):
 * - title: string (required)
 * - description: string (optional)
 * - tech_stack: string[] (optional)
 * - impact_metric: string (optional)
 * - screenshot_url: string (optional)
 * - github_url: string (optional)
 * - live_url: string (optional)
 * - is_featured: boolean (default: false)
 * - display_order: number (default: 0)
 *
 * EXPERIENCES Collection (experiences):
 * - role: string (required)
 * - company: string (required)
 * - description: string (optional)
 * - start_date: string (optional, ISO date)
 * - end_date: string (optional, ISO date)
 * - is_current: boolean (default: false)
 * - experience_type: string ('work' | 'education' | 'volunteer')
 * - skills: string[] (optional)
 * - display_order: number (default: 0)
 *
 * CONTACT_SUBMISSIONS Collection (contact_submissions):
 * - name: string (required)
 * - email: string (required)
 * - message: string (required)
 * - is_read: boolean (default: false)
 *
 * ANALYTICS Collection (analytics):
 * - page_path: string (required)
 * - visitor_country: string (optional)
 * - visitor_city: string (optional)
 * - visitor_region: string (optional)
 * - user_agent: string (optional)
 * - referrer: string (optional)
 *
 * USER_ROLES Collection (user_roles):
 * - user_id: string (required)
 * - role: string ('admin' | 'user')
 *
 * SITE_SETTINGS Collection (site_settings):
 * - key: string (required, unique)
 * - value: object (optional)
 */

export interface Project extends Models.Document {
  title: string;
  description: string | null;
  tech_stack: string[];
  impact_metric: string | null;
  screenshot_url: string | null;
  github_url: string | null;
  live_url: string | null;
  is_featured: boolean;
  display_order: number;
  problem_statement?: string;
  solution?: string;
  contribution?: string;
}

export interface Experience {
  $id: string;
  role: string;
  company: string;
  description?: string;
  summary?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  experience_type?: string;
  skills?: string[];
  responsibilities?: string[];
  impact?: string[];
  display_order?: number;
}

export interface ContactSubmission extends Models.Document {
  name: string;
  email: string;
  message: string;
  is_read: boolean;
}

export interface Analytics extends Models.Document {
  page_path: string;
  visitor_country: string | null;
  visitor_city: string | null;
  visitor_region: string | null;
  user_agent: string | null;
  referrer: string | null;
}

export interface UserRole extends Models.Document {
  user_id: string;
  role: "admin" | "user";
}

export interface SiteSetting extends Models.Document {
  key: string;
  value: Record<string, unknown> | null;
}

export type AppRole = "admin" | "user";

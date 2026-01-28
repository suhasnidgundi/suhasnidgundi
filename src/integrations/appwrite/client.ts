import { Client, Account, Databases, Storage } from 'appwrite';

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
  throw new Error('Missing Appwrite configuration. Please set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID');
}

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs - these should match your Appwrite setup
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'portfolio_db';

// Collection IDs
export const COLLECTIONS = {
  PROJECTS: 'projects',
  EXPERIENCES: 'experiences',
  CONTACT_SUBMISSIONS: 'contact_submissions',
  ANALYTICS: 'analytics',
  USER_ROLES: 'user_roles',
  SITE_SETTINGS: 'site_settings',
} as const;

// Storage bucket IDs
export const BUCKETS = {
  PORTFOLIO_ASSETS: 'portfolio-assets',
} as const;

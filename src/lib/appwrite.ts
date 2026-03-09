/// <reference types="vite/client" />

import { Client, Account, Databases, ID, Query } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.error(
    "Appwrite env vars missing! Make sure VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID are set in your .env file."
  );
}

const client = new Client();

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);

export { ID, Query };

export const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID || "";

export const PROFILES_ID = "profiles";
export const QUESTIONS_ID = "questions";
export const STATS_ID = "cached_stats";
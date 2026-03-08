/// <reference types="vite/client" />

import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export { ID, Query };

export const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID;

export const PROFILES_ID = "profiles";
export const QUESTIONS_ID = "questions";
export const STATS_ID = "cached_stats";
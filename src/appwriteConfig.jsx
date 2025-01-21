// /utils/appwriteConfig.jsx

import { Client, Account } from 'appwrite';
import { AppVariables } from './utils/AppVariables'; // Correct path for AppVariables

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint(AppVariables.API_ENDPOINT) // Dynamically fetch the API endpoint
    .setProject(AppVariables.PROJECT_ID);   // Dynamically fetch the project ID

// Export the Account instance for authentication purposes
export const account = new Account(client);

// Export the client for use throughout the app
export default client;

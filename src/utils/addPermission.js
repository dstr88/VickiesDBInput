// ./utils/addPermissions.js

import { Client, Databases, Permission, Role } from "appwrite";
import { AppVariables } from './AppVariables';

const client = new Client()
    .setEndpoint(AppVariables.API_ENDPOINT)
    .setProject(AppVariables.PROJECT_ID);

const databases = new Databases(client);

export const updateDocumentPermissions = async (documentId, Donnie) => {
    try {
        const permissions = [
            Permission.read(Role.any()), // Anyone can read
            Permission.update(Role.user(Donnie)), // Specific user can update
            Permission.delete(Role.user(Donnie)) // Specific user can delete
        ];

        const response = await databases.updateDocument(
            AppVariables.DATABASE,
            AppVariables.COLLECTION_ID,
            documentId,
            {},
            permissions
        );
        console.log('Permissions updated:', response);
    } catch (error) {
        console.error('Error updating permissions:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
};

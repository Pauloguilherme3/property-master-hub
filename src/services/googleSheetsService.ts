
import { sheetsService } from "./sheetsService";
import { User } from "@/types";

// Google Sheets Service for application-specific operations
class GoogleSheetsService {
  private isInitialized = false;

  // Check if connected to Google Sheets
  isConnectedToSheets(): boolean {
    return sheetsService.isConnectedToSheets();
  }

  // Connect to Google Sheets
  async connect(): Promise<void> {
    try {
      await sheetsService.connect();
      this.isInitialized = true;
      console.log("Connected to Google Sheets service");
    } catch (error) {
      console.error("Failed to connect to Google Sheets:", error);
      throw error;
    }
  }

  // Close the connection
  async close(): Promise<void> {
    try {
      await sheetsService.close();
      this.isInitialized = false;
    } catch (error) {
      console.error("Error closing Google Sheets connection:", error);
      throw error;
    }
  }

  // Add a document to a collection
  async addDocument(collectionName: string, data: any): Promise<{ id: string }> {
    if (!this.isConnectedToSheets()) {
      await this.connect();
    }
    
    const collection = sheetsService.getCollection(collectionName);
    const result = await collection.insertOne(data);
    
    return { id: result.insertedId.toString() };
  }

  // Update a document in a collection
  async updateDocument(collectionName: string, id: string, data: any): Promise<boolean> {
    if (!this.isConnectedToSheets()) {
      await this.connect();
    }
    
    const collection = sheetsService.getCollection(collectionName);
    const result = await collection.updateOne({ _id: id }, { $set: data });
    
    return result.modifiedCount > 0;
  }

  // Find a user by email
  async findUserByEmail(email: string): Promise<User | null> {
    if (!this.isConnectedToSheets()) {
      await this.connect();
    }
    
    const collection = sheetsService.getCollection<User>('users');
    return collection.findOne({ email: email });
  }

  // Get all documents from a collection
  async getAllDocuments<T>(collectionName: string): Promise<T[]> {
    if (!this.isConnectedToSheets()) {
      await this.connect();
    }
    
    const collection = sheetsService.getCollection<T>(collectionName);
    return collection.find().toArray();
  }
}

// Singleton instance
export const googleSheetsService = new GoogleSheetsService();

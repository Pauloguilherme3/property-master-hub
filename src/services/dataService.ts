
import { sheetsService } from "./sheetsService";

// Data service that provides a unified interface for data operations
// This abstracts away the specific storage backend (Google Sheets)
class DataService {
  private isInitialized: boolean = false;

  // Initialize the data service
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    
    try {
      await sheetsService.connect();
      this.isInitialized = true;
      console.log("Data service initialized with Google Sheets backend");
    } catch (error) {
      console.error("Failed to initialize data service:", error);
      throw error;
    }
  }

  // Get a collection
  getCollection<T = any>(name: string) {
    if (!this.isInitialized) {
      throw new Error("Data service not initialized");
    }
    
    return sheetsService.getCollection<T>(name);
  }

  // Create document
  async createDocument<T>(collectionName: string, data: T): Promise<{ id: string }> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const collection = this.getCollection(collectionName);
    const result = await collection.insertOne(data);
    
    return { id: result.insertedId.toString() };
  }

  // Get document by ID
  async getDocument<T>(collectionName: string, id: string): Promise<T | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const collection = this.getCollection(collectionName);
    return collection.findOne({ _id: id });
  }

  // Get all documents
  async getAllDocuments<T>(collectionName: string): Promise<T[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const collection = this.getCollection(collectionName);
    return collection.find().toArray();
  }

  // Query documents
  async queryDocuments<T>(collectionName: string, query: any): Promise<T[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const collection = this.getCollection(collectionName);
    return collection.find(query).toArray();
  }

  // Update document
  async updateDocument<T>(collectionName: string, id: string, data: Partial<T>): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const collection = this.getCollection(collectionName);
    const result = await collection.updateOne({ _id: id }, { $set: data });
    
    return result.modifiedCount > 0;
  }

  // Delete document
  async deleteDocument(collectionName: string, id: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const collection = this.getCollection(collectionName);
    const result = await collection.deleteOne({ _id: id });
    
    return result.deletedCount > 0;
  }
  
  // Check if service is ready
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const dataService = new DataService();


import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

// MongoDB connection class
class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;
  private static instance: MongoDBService;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  // Connect to MongoDB
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to MongoDB');
      return;
    }

    try {
      const uri = import.meta.env.VITE_MONGODB_KEY_PUBLIC || '';
      
      if (!uri) {
        throw new Error('MongoDB connection string is not provided');
      }

      console.log('Connecting to MongoDB...');
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db();
      this.isConnected = true;
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  // Get a collection
  public getCollection<T>(collectionName: string): Collection<T> {
    if (!this.isConnected || !this.db) {
      throw new Error('Not connected to MongoDB');
    }
    return this.db.collection<T>(collectionName);
  }

  // Close connection
  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      this.db = null;
      console.log('MongoDB connection closed');
    }
  }

  // Check connection status
  public isConnectedToDB(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const mongoDBService = MongoDBService.getInstance();

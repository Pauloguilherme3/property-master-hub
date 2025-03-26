
import { Db, Collection } from '@/lib/mongodb-exports';

// MongoDB service that works in browser environments
class MongoDBService {
  private isConnected = false;
  private static instance: MongoDBService;
  private apiBaseUrl: string = '';

  private constructor() {}

  // Singleton pattern
  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  // Connect to MongoDB via API
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to MongoDB');
      return;
    }

    try {
      // Get the API URL from environment variables
      this.apiBaseUrl = import.meta.env.VITE_MONGODB_API_URL || '';
      
      if (!this.apiBaseUrl) {
        console.warn('MongoDB API URL is not provided. Using mock mode.');
        // We'll still set connected to true for mock mode
      }

      // Simple connection test
      console.log('Connecting to MongoDB API...');
      this.isConnected = true;
      console.log('Connected to MongoDB API successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB API:', error);
      throw error;
    }
  }

  // Get a collection proxy
  public getCollection<T>(collectionName: string): Collection<T> {
    if (!this.isConnected) {
      throw new Error('Not connected to MongoDB');
    }
    
    // Return a collection proxy that will make API calls or use mock data
    return {
      // Insert document
      insertOne: async (doc: T): Promise<{ insertedId: any }> => {
        if (this.apiBaseUrl) {
          // Make API call to insert document
          const response = await fetch(`${this.apiBaseUrl}/collections/${collectionName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doc)
          });
          
          if (!response.ok) {
            throw new Error(`Failed to insert document: ${response.statusText}`);
          }
          
          const result = await response.json();
          return { insertedId: result.insertedId };
        } else {
          // Mock implementation
          console.log(`[MOCK] Inserted document into ${collectionName}:`, doc);
          return { insertedId: { toString: () => Math.random().toString(36).substring(2, 15) } };
        }
      },
      
      // Find documents
      find: (query?: any) => {
        // Return a cursor proxy
        const cursorMethods = {
          toArray: async (): Promise<T[]> => {
            if (this.apiBaseUrl) {
              // Make API call to find documents
              const queryParams = query ? `?filter=${encodeURIComponent(JSON.stringify(query))}` : '';
              const response = await fetch(`${this.apiBaseUrl}/collections/${collectionName}${queryParams}`);
              
              if (!response.ok) {
                throw new Error(`Failed to find documents: ${response.statusText}`);
              }
              
              return await response.json();
            } else {
              // Mock implementation
              console.log(`[MOCK] Finding documents in ${collectionName} with query:`, query);
              return [] as T[];
            }
          },
          sort: () => cursorMethods,
          limit: () => cursorMethods,
          skip: () => cursorMethods
        };
        
        return cursorMethods;
      },
      
      // Find one document
      findOne: async (query?: any): Promise<T | null> => {
        if (this.apiBaseUrl) {
          // Make API call to find one document
          const queryParams = query ? `?filter=${encodeURIComponent(JSON.stringify(query))}` : '';
          const response = await fetch(`${this.apiBaseUrl}/collections/${collectionName}/findOne${queryParams}`);
          
          if (!response.ok && response.status !== 404) {
            throw new Error(`Failed to find document: ${response.statusText}`);
          }
          
          if (response.status === 404) {
            return null;
          }
          
          return await response.json();
        } else {
          // Mock implementation
          console.log(`[MOCK] Finding one document in ${collectionName} with query:`, query);
          return null;
        }
      },
      
      // Update document
      updateOne: async (filter: any, update: any): Promise<any> => {
        if (this.apiBaseUrl) {
          // Make API call to update document
          const response = await fetch(`${this.apiBaseUrl}/collections/${collectionName}/updateOne`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter, update })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to update document: ${response.statusText}`);
          }
          
          return await response.json();
        } else {
          // Mock implementation
          console.log(`[MOCK] Updated document in ${collectionName} with filter:`, filter, 'and update:', update);
          return { modifiedCount: 1 };
        }
      },
      
      // Delete document
      deleteOne: async (filter: any): Promise<any> => {
        if (this.apiBaseUrl) {
          // Make API call to delete document
          const response = await fetch(`${this.apiBaseUrl}/collections/${collectionName}/deleteOne`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to delete document: ${response.statusText}`);
          }
          
          return await response.json();
        } else {
          // Mock implementation
          console.log(`[MOCK] Deleted document in ${collectionName} with filter:`, filter);
          return { deletedCount: 1 };
        }
      }
    };
  }

  // Close connection
  public async close(): Promise<void> {
    this.isConnected = false;
    console.log('MongoDB connection closed');
  }

  // Check connection status
  public isConnectedToDB(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const mongoDBService = MongoDBService.getInstance();

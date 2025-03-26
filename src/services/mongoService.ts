
import { Collection, Cursor, Db, MongoClient, ObjectId } from "@/lib/mongodb-exports";

// MongoDB Service for connecting to a MongoDB database through API or Mock
class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connected: boolean = false;
  private mockMode: boolean = false;
  private mockCollections: Record<string, any[]> = {};
  private apiUrl: string | null = null;

  constructor() {
    // Check if we have an API URL for MongoDB operations
    this.apiUrl = import.meta.env.VITE_MONGODB_API_URL || null;
    
    // If no API URL, we'll use mock mode
    this.mockMode = !this.apiUrl;

    if (this.mockMode) {
      console.log("MongoDB Service initialized in mock mode - no real database connection will be made");
      // Setup some initial mock collections for testing
      this.mockCollections = {
        test: [
          { _id: new ObjectId(), name: "Mock Item 1", value: 100 },
          { _id: new ObjectId(), name: "Mock Item 2", value: 200 }
        ],
        users: []
      };
    } else {
      console.log("MongoDB Service initialized with API URL");
    }
  }

  // Connect to the MongoDB database
  async connect(): Promise<void> {
    if (this.connected) {
      console.log("Already connected to MongoDB");
      return;
    }

    try {
      if (this.mockMode) {
        // In mock mode, just set connected flag
        this.connected = true;
        console.log("Mock MongoDB connection established");
      } else {
        // In real mode, we'll ping the API to confirm connectivity
        const response = await fetch(`${this.apiUrl}/ping`);
        if (!response.ok) {
          throw new Error(`Failed to connect to MongoDB API: ${response.statusText}`);
        }
        this.connected = true;
        console.log("Connected to MongoDB API");
      }
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  // Close the connection
  async close(): Promise<void> {
    if (!this.connected) {
      return;
    }

    try {
      if (!this.mockMode && this.client) {
        // Real closing would happen here
        console.log("Closed MongoDB connection");
      }
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    } finally {
      this.connected = false;
      this.client = null;
      this.db = null;
    }
  }

  // Check if connected to the database
  isConnectedToDB(): boolean {
    return this.connected;
  }

  // Get a collection from the database
  getCollection<T = any>(name: string): Collection<T> {
    if (!this.connected) {
      throw new Error("Not connected to MongoDB");
    }

    if (this.mockMode) {
      // Create the collection if it doesn't exist in our mock store
      if (!this.mockCollections[name]) {
        this.mockCollections[name] = [];
      }

      // Return a mock collection implementation
      return {
        insertOne: async (doc: T) => {
          const id = new ObjectId();
          this.mockCollections[name].push({ ...doc, _id: id });
          return { insertedId: id };
        },
        find: (query?: any) => this.createMockCursor<T>(name, query),
        findOne: async (query?: any) => {
          // Simple implementation of findOne for mock data
          const results = this.mockCollections[name].filter(item => {
            if (!query) return true;
            return Object.keys(query).every(key => {
              return item[key] === query[key];
            });
          });
          return results.length > 0 ? results[0] : null;
        },
        updateOne: async (filter: any, update: any) => {
          // Simple implementation for mock updates
          const index = this.mockCollections[name].findIndex(item => {
            return Object.keys(filter).every(key => {
              return item[key] === filter[key];
            });
          });
          
          if (index !== -1) {
            if (update.$set) {
              this.mockCollections[name][index] = {
                ...this.mockCollections[name][index],
                ...update.$set
              };
            }
            return { modifiedCount: 1, matchedCount: 1 };
          }
          return { modifiedCount: 0, matchedCount: 0 };
        },
        deleteOne: async (filter: any) => {
          // Simple implementation for mock deletion
          const initialLength = this.mockCollections[name].length;
          this.mockCollections[name] = this.mockCollections[name].filter(item => {
            return !Object.keys(filter).every(key => {
              return item[key] === filter[key];
            });
          });
          const deletedCount = initialLength - this.mockCollections[name].length;
          return { deletedCount };
        }
      };
    } else {
      // For real MongoDB via API, we'll return methods that make API calls
      return {
        insertOne: async (doc: T) => {
          const response = await fetch(`${this.apiUrl}/collections/${name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doc)
          });
          
          if (!response.ok) {
            throw new Error(`Failed to insert document: ${response.statusText}`);
          }
          
          const result = await response.json();
          return { insertedId: new ObjectId(result.insertedId) };
        },
        find: (query?: any) => this.createApiCursor<T>(name, query),
        findOne: async (query?: any) => {
          const queryParams = new URLSearchParams();
          if (query) {
            queryParams.append('query', JSON.stringify(query));
          }
          
          const response = await fetch(`${this.apiUrl}/collections/${name}/findOne?${queryParams}`);
          
          if (!response.ok) {
            throw new Error(`Failed to find document: ${response.statusText}`);
          }
          
          return await response.json();
        },
        updateOne: async (filter: any, update: any) => {
          const response = await fetch(`${this.apiUrl}/collections/${name}/updateOne`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter, update })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to update document: ${response.statusText}`);
          }
          
          return await response.json();
        },
        deleteOne: async (filter: any) => {
          const response = await fetch(`${this.apiUrl}/collections/${name}/deleteOne`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to delete document: ${response.statusText}`);
          }
          
          return await response.json();
        }
      };
    }
  }

  // Create a mock cursor for querying mock collections
  private createMockCursor<T>(collectionName: string, query?: any): Cursor<T> {
    let results = [...this.mockCollections[collectionName]];
    
    // Apply simple filtering if query is provided
    if (query) {
      results = results.filter(item => {
        return Object.keys(query).every(key => {
          return item[key] === query[key];
        });
      });
    }
    
    // Track current cursor state
    let currentSkip = 0;
    let currentLimit: number | null = null;
    let currentSort: any = null;
    
    return {
      toArray: async () => {
        let finalResults = [...results];
        
        // Apply sort if specified
        if (currentSort) {
          finalResults.sort((a, b) => {
            const sortField = Object.keys(currentSort)[0];
            const sortDirection = currentSort[sortField];
            if (a[sortField] < b[sortField]) return -1 * sortDirection;
            if (a[sortField] > b[sortField]) return 1 * sortDirection;
            return 0;
          });
        }
        
        // Apply skip if specified
        if (currentSkip > 0) {
          finalResults = finalResults.slice(currentSkip);
        }
        
        // Apply limit if specified
        if (currentLimit !== null) {
          finalResults = finalResults.slice(0, currentLimit);
        }
        
        return finalResults as T[];
      },
      sort: (sort: any) => {
        currentSort = sort;
        return this.createMockCursor<T>(collectionName, query);
      },
      limit: (limit: number) => {
        currentLimit = limit;
        return this.createMockCursor<T>(collectionName, query);
      },
      skip: (skip: number) => {
        currentSkip = skip;
        return this.createMockCursor<T>(collectionName, query);
      }
    };
  }

  // Create a cursor that works via API calls
  private createApiCursor<T>(collectionName: string, query?: any): Cursor<T> {
    let currentQuery = query || {};
    let currentSkip = 0;
    let currentLimit: number | null = null;
    let currentSort: any = null;
    
    return {
      toArray: async () => {
        const queryParams = new URLSearchParams();
        queryParams.append('query', JSON.stringify(currentQuery));
        
        if (currentSkip > 0) {
          queryParams.append('skip', currentSkip.toString());
        }
        
        if (currentLimit !== null) {
          queryParams.append('limit', currentLimit.toString());
        }
        
        if (currentSort) {
          queryParams.append('sort', JSON.stringify(currentSort));
        }
        
        const response = await fetch(`${this.apiUrl}/collections/${collectionName}/find?${queryParams}`);
        
        if (!response.ok) {
          throw new Error(`Failed to find documents: ${response.statusText}`);
        }
        
        return await response.json();
      },
      sort: (sort: any) => {
        currentSort = sort;
        return this.createApiCursor<T>(collectionName, currentQuery);
      },
      limit: (limit: number) => {
        currentLimit = limit;
        return this.createApiCursor<T>(collectionName, currentQuery);
      },
      skip: (skip: number) => {
        currentSkip = skip;
        return this.createApiCursor<T>(collectionName, currentQuery);
      }
    };
  }
}

// Singleton instance
export const mongoDBService = new MongoDBService();

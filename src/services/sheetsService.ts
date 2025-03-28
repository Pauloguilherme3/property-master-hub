
import { 
  Collection, 
  Cursor, 
  Db, 
  SheetsClient as GoogleSheetsClient, 
  ObjectId 
} from "@/lib/sheets-exports";

// Google Sheets Service for connecting to Google Sheets
class GoogleSheetsService {
  private client: GoogleSheetsClient | null = null;
  private db: Db | null = null;
  private connected: boolean = false;
  private mockMode: boolean = true;
  private mockCollections: Record<string, any[]> = {};
  private apiKey: string | null = null;

  constructor() {
    // Check if we have an API key for Google Sheets
    this.apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || null;
    
    // If no API key, we'll use mock mode (always true for now since we're just replacing)
    this.mockMode = !this.apiKey || true;

    if (this.mockMode) {
      console.log("Google Sheets Service initialized in mock mode - using local storage");
      
      // Try to load mock collections from localStorage
      try {
        const storedCollections = localStorage.getItem('googleSheetsMockData');
        if (storedCollections) {
          this.mockCollections = JSON.parse(storedCollections);
        } else {
          // Setup some initial mock collections for testing
          this.mockCollections = {
            test: [
              { _id: new ObjectId().toString(), name: "Sheet Item 1", value: 100 },
              { _id: new ObjectId().toString(), name: "Sheet Item 2", value: 200 }
            ],
            users: [],
            empreendimentos: [],
            unidades: [],
            reservas: [],
            leads: []
          };
          // Save to localStorage
          this.saveToLocalStorage();
        }
      } catch (e) {
        console.error("Error loading mock data from localStorage", e);
        // Setup fallback mock collections
        this.mockCollections = {
          test: [
            { _id: new ObjectId().toString(), name: "Sheet Item 1", value: 100 },
            { _id: new ObjectId().toString(), name: "Sheet Item 2", value: 200 }
          ],
          users: []
        };
      }
    } else {
      console.log("Google Sheets Service initialized with API key");
    }
  }

  // Save mock data to localStorage
  private saveToLocalStorage() {
    try {
      localStorage.setItem('googleSheetsMockData', JSON.stringify(this.mockCollections));
    } catch (e) {
      console.error("Error saving mock data to localStorage", e);
    }
  }

  // Connect to Google Sheets
  async connect(): Promise<void> {
    if (this.connected) {
      console.log("Already connected to Google Sheets");
      return;
    }

    try {
      if (this.mockMode) {
        // In mock mode, just set connected flag
        this.connected = true;
        console.log("Mock Google Sheets connection established");
      } else {
        // In real mode, we would initialize the Google Sheets API client
        // For now, just simulate successful connection
        console.log("Connecting to Google Sheets...");
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 500));
        this.connected = true;
        console.log("Connected to Google Sheets API");
      }
    } catch (error) {
      console.error("Error connecting to Google Sheets:", error);
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
        console.log("Closed Google Sheets connection");
      }
    } catch (error) {
      console.error("Error closing Google Sheets connection:", error);
    } finally {
      this.connected = false;
      this.client = null;
      this.db = null;
    }
  }

  // Check if connected to Google Sheets
  isConnectedToSheets(): boolean {
    return this.connected;
  }

  // Get a collection from Google Sheets
  getCollection<T = any>(name: string): Collection<T> {
    if (!this.connected) {
      throw new Error("Not connected to Google Sheets");
    }

    // Create the collection if it doesn't exist in our mock store
    if (!this.mockCollections[name]) {
      this.mockCollections[name] = [];
      this.saveToLocalStorage();
    }

    // Return a mock collection implementation
    return {
      insertOne: async (doc: T) => {
        const id = new ObjectId();
        const idStr = id.toString();
        this.mockCollections[name].push({ ...doc, _id: idStr });
        this.saveToLocalStorage();
        return { insertedId: id };
      },
      find: (query?: any) => this.createCursor<T>(name, query),
      findOne: async (query?: any) => {
        // Simple implementation of findOne for mock data
        const results = this.mockCollections[name].filter(item => {
          if (!query) return true;
          return Object.keys(query).every(key => {
            if (key === '_id' && typeof query[key] === 'string') {
              return item[key] === query[key];
            }
            return item[key] === query[key];
          });
        });
        return results.length > 0 ? results[0] : null;
      },
      updateOne: async (filter: any, update: any) => {
        // Simple implementation for mock updates
        const index = this.mockCollections[name].findIndex(item => {
          return Object.keys(filter).every(key => {
            if (key === '_id' && typeof filter[key] === 'string') {
              return item[key] === filter[key];
            }
            return item[key] === filter[key];
          });
        });
        
        if (index !== -1) {
          if (update.$set) {
            this.mockCollections[name][index] = {
              ...this.mockCollections[name][index],
              ...update.$set
            };
          } else {
            // Treat update as direct object to merge
            this.mockCollections[name][index] = {
              ...this.mockCollections[name][index],
              ...update
            };
          }
          this.saveToLocalStorage();
          return { modifiedCount: 1, matchedCount: 1 };
        }
        return { modifiedCount: 0, matchedCount: 0 };
      },
      deleteOne: async (filter: any) => {
        // Simple implementation for mock deletion
        const initialLength = this.mockCollections[name].length;
        this.mockCollections[name] = this.mockCollections[name].filter(item => {
          return !Object.keys(filter).every(key => {
            if (key === '_id' && typeof filter[key] === 'string') {
              return item[key] === filter[key];
            }
            return item[key] === filter[key];
          });
        });
        const deletedCount = initialLength - this.mockCollections[name].length;
        if (deletedCount > 0) {
          this.saveToLocalStorage();
        }
        return { deletedCount };
      }
    };
  }

  // Create a cursor for querying collections
  private createCursor<T>(collectionName: string, query?: any): Cursor<T> {
    let results = [...this.mockCollections[collectionName]];
    
    // Apply simple filtering if query is provided
    if (query) {
      results = results.filter(item => {
        return Object.keys(query).every(key => {
          if (key === '_id' && typeof query[key] === 'string') {
            return item[key] === query[key];
          }
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
        return this.createCursor<T>(collectionName, query);
      },
      limit: (limit: number) => {
        currentLimit = limit;
        return this.createCursor<T>(collectionName, query);
      },
      skip: (skip: number) => {
        currentSkip = skip;
        return this.createCursor<T>(collectionName, query);
      }
    };
  }
}

// Singleton instance
export const sheetsService = new GoogleSheetsService();

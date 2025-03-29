
// Real Google Sheets Service using Google Sheets API
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
  private documentId: string | null = null;
  private sheetsApiInitialized: boolean = false;
  private sheetNames: Record<string, string> = {
    empreendimentos: import.meta.env.VITE_GOOGLE_SHEET_PROPERTIES || 'EmpreendimentosData',
    unidades: import.meta.env.VITE_GOOGLE_SHEET_UNITS || 'UnidadesData',
    reservas: import.meta.env.VITE_GOOGLE_SHEET_RESERVATIONS || 'ReservasData',
    users: import.meta.env.VITE_GOOGLE_SHEET_USERS || 'UsuariosData',
  };

  constructor() {
    // Check if we have an API key for Google Sheets
    this.apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || null;
    this.documentId = import.meta.env.VITE_GOOGLE_SHEETS_DOCUMENT_ID || null;
    
    // If no API key or document ID, we'll use mock mode
    this.mockMode = !this.apiKey || !this.documentId;

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
          users: [],
          empreendimentos: [],
          unidades: [],
          reservas: []
        };
      }
    } else {
      console.log("Google Sheets Service initialized with API key and Document ID");
      this.initGoogleSheetsApi();
    }
  }

  // Initialize Google Sheets API
  private async initGoogleSheetsApi() {
    if (this.sheetsApiInitialized) return;
    
    try {
      console.log("Loading Google Sheets API...");
      
      if (!this.apiKey) {
        console.error("Google Sheets API key not found");
        this.mockMode = true;
        return;
      }
      
      if (!this.documentId) {
        console.error("Google Sheets Document ID not found");
        this.mockMode = true;
        return;
      }
      
      // Load the Google API client library
      if (typeof window !== 'undefined' && !window.gapi) {
        // This would be handled by adding the script to index.html
        // or dynamically loading it here
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google API client script loaded");
          this.loadGapiClient();
        };
        document.head.appendChild(script);
      } else if (window.gapi) {
        this.loadGapiClient();
      } else {
        console.log("Google API client not loaded, using mock mode for now");
        this.mockMode = true;
      }
    } catch (error) {
      console.error("Error initializing Google Sheets API:", error);
      this.mockMode = true;
    }
  }
  
  // Load Google API client
  private loadGapiClient() {
    window.gapi.load('client', () => {
      window.gapi.client.init({
        apiKey: this.apiKey,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
      }).then(() => {
        this.sheetsApiInitialized = true;
        console.log("Google Sheets API initialized");
      }).catch((error: any) => {
        console.error("Error initializing Google API client:", error);
        this.mockMode = true;
      });
    });
  }

  // Save mock data to localStorage
  private saveToLocalStorage() {
    try {
      localStorage.setItem('googleSheetsMockData', JSON.stringify(this.mockCollections));
    } catch (e) {
      console.error("Error saving mock data to localStorage", e);
    }
  }

  // Get actual sheet name for collection
  private getSheetName(collectionName: string): string {
    return this.sheetNames[collectionName] || collectionName;
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
        // Initialize real Google Sheets API
        await this.initGoogleSheetsApi();
        
        if (!this.sheetsApiInitialized && window.gapi) {
          await new Promise<void>((resolve) => {
            const checkInitialized = () => {
              if (this.sheetsApiInitialized) {
                resolve();
              } else {
                setTimeout(checkInitialized, 100);
              }
            };
            checkInitialized();
          });
        }
        
        // Test the connection by trying to access the spreadsheet
        if (this.sheetsApiInitialized) {
          try {
            await window.gapi.client.sheets.spreadsheets.get({
              spreadsheetId: this.documentId
            });
            this.connected = true;
            console.log("Connected to Google Sheets API");
          } catch (error) {
            console.error("Error accessing Google Sheets document:", error);
            this.mockMode = true;
            this.connected = true; // Fall back to mock mode
          }
        } else {
          // Fall back to mock mode
          this.mockMode = true;
          this.connected = true;
          console.log("Falling back to mock mode");
        }
      }
    } catch (error) {
      console.error("Error connecting to Google Sheets:", error);
      // Fall back to mock mode
      this.mockMode = true;
      this.connected = true;
      console.log("Falling back to mock mode");
    }
  }

  // Close the connection
  async close(): Promise<void> {
    if (!this.connected) {
      return;
    }

    try {
      if (!this.mockMode) {
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

    // Get the actual sheet name
    const sheetName = this.getSheetName(name);

    if (this.mockMode) {
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
          const docWithId = { ...doc, _id: idStr, id: idStr };
          this.mockCollections[name].push(docWithId);
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
    } else {
      // Real Google Sheets API implementation
      return {
        insertOne: async (doc: T) => {
          try {
            const id = new ObjectId();
            const idStr = id.toString();
            const docWithId = { ...doc, _id: idStr, id: idStr };
            
            // Get the sheet data to find the next row
            const response = await window.gapi.client.sheets.spreadsheets.values.get({
              spreadsheetId: this.documentId,
              range: sheetName
            });
            
            const values = response.result.values || [];
            const headers = values[0] || [];
            
            // If the sheet is empty, create headers
            if (values.length === 0) {
              const docHeaders = Object.keys(docWithId);
              await window.gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: this.documentId,
                range: `${sheetName}!A1`,
                valueInputOption: 'RAW',
                resource: {
                  values: [docHeaders]
                }
              });
              
              // Add the data in the next row
              const docValues = docHeaders.map(header => docWithId[header] || '');
              await window.gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: this.documentId,
                range: `${sheetName}!A2`,
                valueInputOption: 'RAW',
                resource: {
                  values: [docValues]
                }
              });
            } else {
              // Sheet already has headers, add new row
              const docValues = headers.map(header => docWithId[header] || '');
              await window.gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: this.documentId,
                range: `${sheetName}!A1`,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource: {
                  values: [docValues]
                }
              });
            }
            
            // Store in mock collections as cache
            if (!this.mockCollections[name]) {
              this.mockCollections[name] = [];
            }
            this.mockCollections[name].push(docWithId);
            this.saveToLocalStorage();
            
            return { insertedId: id };
          } catch (error) {
            console.error(`Error inserting document into ${sheetName}:`, error);
            
            // Fall back to mock mode
            const id = new ObjectId();
            const idStr = id.toString();
            const docWithId = { ...doc, _id: idStr, id: idStr };
            if (!this.mockCollections[name]) {
              this.mockCollections[name] = [];
            }
            this.mockCollections[name].push(docWithId);
            this.saveToLocalStorage();
            
            return { insertedId: id };
          }
        },
        find: (query?: any) => this.createCursor<T>(name, query),
        findOne: async (query?: any) => {
          try {
            if (this.sheetsApiInitialized) {
              // Get all rows from the sheet
              const response = await window.gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: this.documentId,
                range: sheetName
              });
              
              const values = response.result.values || [];
              if (values.length <= 1) {
                return null; // Only headers or empty sheet
              }
              
              const headers = values[0];
              const documents = values.slice(1).map(row => {
                const doc: any = {};
                headers.forEach((header, index) => {
                  doc[header] = row[index] || '';
                });
                return doc;
              });
              
              // Update mock collections as cache
              this.mockCollections[name] = documents;
              this.saveToLocalStorage();
              
              // Filter by query
              const results = documents.filter(item => {
                if (!query) return true;
                return Object.keys(query).every(key => {
                  if (key === '_id' && typeof query[key] === 'string') {
                    return item[key] === query[key];
                  }
                  return item[key] === query[key];
                });
              });
              
              return results.length > 0 ? results[0] : null;
            } else {
              // Fall back to mock implementation
              const results = this.mockCollections[name]?.filter(item => {
                if (!query) return true;
                return Object.keys(query).every(key => {
                  if (key === '_id' && typeof query[key] === 'string') {
                    return item[key] === query[key];
                  }
                  return item[key] === query[key];
                });
              }) || [];
              
              return results.length > 0 ? results[0] : null;
            }
          } catch (error) {
            console.error(`Error finding document in ${sheetName}:`, error);
            
            // Fall back to mock implementation
            const results = this.mockCollections[name]?.filter(item => {
              if (!query) return true;
              return Object.keys(query).every(key => {
                if (key === '_id' && typeof query[key] === 'string') {
                  return item[key] === query[key];
                }
                return item[key] === query[key];
              });
            }) || [];
            
            return results.length > 0 ? results[0] : null;
          }
        },
        updateOne: async (filter: any, update: any) => {
          // For now, fall back to mock implementation
          const index = this.mockCollections[name]?.findIndex(item => {
            return Object.keys(filter).every(key => {
              if (key === '_id' && typeof filter[key] === 'string') {
                return item[key] === filter[key];
              }
              return item[key] === filter[key];
            });
          }) || -1;
          
          if (index !== -1) {
            if (update.$set) {
              this.mockCollections[name][index] = {
                ...this.mockCollections[name][index],
                ...update.$set
              };
            } else {
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
          // For now, fall back to mock implementation
          const initialLength = this.mockCollections[name]?.length || 0;
          if (this.mockCollections[name]) {
            this.mockCollections[name] = this.mockCollections[name].filter(item => {
              return !Object.keys(filter).every(key => {
                if (key === '_id' && typeof filter[key] === 'string') {
                  return item[key] === filter[key];
                }
                return item[key] === filter[key];
              });
            });
          }
          const deletedCount = initialLength - (this.mockCollections[name]?.length || 0);
          if (deletedCount > 0) {
            this.saveToLocalStorage();
          }
          return { deletedCount };
        }
      };
    }
  }

  // Create a cursor for querying collections
  private createCursor<T>(collectionName: string, query?: any): Cursor<T> {
    let results = [...(this.mockCollections[collectionName] || [])];
    
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
        // If using real Google Sheets API and initialized
        if (!this.mockMode && this.sheetsApiInitialized) {
          try {
            const sheetName = this.getSheetName(collectionName);
            
            // Get all rows from the sheet
            const response = await window.gapi.client.sheets.spreadsheets.values.get({
              spreadsheetId: this.documentId,
              range: sheetName
            });
            
            const values = response.result.values || [];
            if (values.length <= 1) {
              return []; // Only headers or empty sheet
            }
            
            const headers = values[0];
            let documents = values.slice(1).map(row => {
              const doc: any = {};
              headers.forEach((header, index) => {
                doc[header] = row[index] || '';
              });
              return doc;
            });
            
            // Update mock collections as cache
            this.mockCollections[collectionName] = documents;
            this.saveToLocalStorage();
            
            // Apply filtering
            if (query) {
              documents = documents.filter(item => {
                return Object.keys(query).every(key => {
                  if (key === '_id' && typeof query[key] === 'string') {
                    return item[key] === query[key];
                  }
                  return item[key] === query[key];
                });
              });
            }
            
            // Apply sort if specified
            if (currentSort) {
              documents.sort((a, b) => {
                const sortField = Object.keys(currentSort)[0];
                const sortDirection = currentSort[sortField];
                if (a[sortField] < b[sortField]) return -1 * sortDirection;
                if (a[sortField] > b[sortField]) return 1 * sortDirection;
                return 0;
              });
            }
            
            // Apply skip if specified
            if (currentSkip > 0) {
              documents = documents.slice(currentSkip);
            }
            
            // Apply limit if specified
            if (currentLimit !== null) {
              documents = documents.slice(0, currentLimit);
            }
            
            return documents as T[];
          } catch (error) {
            console.error(`Error querying documents from ${collectionName}:`, error);
            // Fall back to mock data
          }
        }
        
        // Use mock data as fallback
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

// Declare global gapi for TypeScript
declare global {
  interface Window {
    gapi: any;
  }
}

// Singleton instance
export const sheetsService = new GoogleSheetsService();

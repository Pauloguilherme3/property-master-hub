
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  readonly VITE_GOOGLE_SHEETS_API_KEY: string
  readonly VITE_GOOGLE_SHEETS_DOCUMENT_ID: string
  readonly VITE_GOOGLE_SHEET_PROPERTIES: string
  readonly VITE_GOOGLE_SHEET_UNITS: string
  readonly VITE_GOOGLE_SHEET_RESERVATIONS: string
  readonly VITE_GOOGLE_SHEET_USERS: string
  readonly VITE_GOOGLE_DRIVE_API_KEY: string
  readonly VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL: string
  readonly VITE_GOOGLE_PRIVATE_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Google API client interfaces
interface Window {
  gapi: {
    load: (api: string, callback: () => void) => void;
    client: {
      init: (config: {
        apiKey: string | null;
        discoveryDocs: string[];
      }) => Promise<void>;
      sheets: {
        spreadsheets: {
          get: (params: { spreadsheetId: string | null }) => Promise<any>;
          values: {
            get: (params: { spreadsheetId: string | null; range: string }) => Promise<any>;
            update: (params: { 
              spreadsheetId: string | null; 
              range: string;
              valueInputOption: string;
              resource: { values: any[][] }
            }) => Promise<any>;
            append: (params: { 
              spreadsheetId: string | null; 
              range: string;
              valueInputOption: string;
              insertDataOption?: string;
              resource: { values: any[][] }
            }) => Promise<any>;
          }
        }
      };
    };
  };
}

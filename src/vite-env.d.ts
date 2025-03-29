
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_GOOGLE_SHEETS_API_KEY: string;
  readonly VITE_GOOGLE_SHEETS_DOCUMENT_ID: string;
  readonly VITE_GOOGLE_SHEET_PROPERTIES: string;
  readonly VITE_GOOGLE_SHEET_UNITS: string;
  readonly VITE_GOOGLE_SHEET_RESERVATIONS: string;
  readonly VITE_GOOGLE_SHEET_USERS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google API Client type definition
interface Window {
  gapi: {
    load: (api: string, callback: () => void) => void;
    client: {
      init: (options: any) => Promise<void>;
      sheets: {
        spreadsheets: {
          get: (options: any) => Promise<any>;
          values: {
            get: (options: any) => Promise<any>;
            update: (options: any) => Promise<any>;
            append: (options: any) => Promise<any>;
          };
        };
      };
    };
  };
}

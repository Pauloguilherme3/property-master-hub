
/// <reference types="vite/client" />

// Reference types for Firebase modules
/// <reference types="firebase/app" />
/// <reference types="firebase/auth" />
/// <reference types="firebase/firestore" />
/// <reference types="firebase/analytics" />

// Reference types for MongoDB
/// <reference types="mongodb" />

// Create a global namespace for Firebase types
declare global {
  namespace Firebase {
    interface Auth {}
    interface User {}
    interface Firestore {}
    interface Storage {}
  }
}

// Explicitly declare module paths for Firebase
declare module 'firebase/app' {
  export * from '@firebase/app-types';
}

declare module 'firebase/auth' {
  export * from '@firebase/auth-types';
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore-types';
}

declare module 'firebase/analytics' {
  // Analytics types
}

// Explicitly declare module for mongodb
declare module 'mongodb' {
  export * from 'mongodb';
}

export {};

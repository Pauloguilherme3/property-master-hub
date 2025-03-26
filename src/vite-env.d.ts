
/// <reference types="vite/client" />

// Add Firebase type references
/// <reference types="@firebase/app-types" />
/// <reference types="@firebase/auth-types" />
/// <reference types="@firebase/firestore-types" />
/// <reference types="@firebase/storage-types" />

// Create a global namespace for Firebase types
declare global {
  namespace Firebase {
    interface Auth {}
    interface User {}
    interface Firestore {}
    interface Storage {}
  }
}

export {};

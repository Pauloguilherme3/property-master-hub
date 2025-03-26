
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

// This explicitly declares the module 'firebase' to avoid the TS2688 error
declare module 'firebase' {
  export * from '@firebase/app-types';
  
  // Add re-exports for other Firebase services
  export namespace auth {
    export * from '@firebase/auth-types';
  }
  
  export namespace firestore {
    export * from '@firebase/firestore-types';
  }
  
  export namespace storage {
    export * from '@firebase/storage-types';
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

export {};

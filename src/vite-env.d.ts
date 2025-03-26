
/// <reference types="vite/client" />

// Create a global namespace for Firebase types
declare namespace Firebase {
  interface Auth {}
  interface User {}
  interface Firestore {}
  interface Storage {}
}

// Explicitly declare module paths for Firebase
declare module 'firebase/app' {
  export function initializeApp(options: any, name?: string): any;
}

declare module 'firebase/auth' {
  export function getAuth(app?: any): any;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export function onAuthStateChanged(auth: any, nextOrObserver: any): () => void;
  export function updateProfile(user: any, profile: any): Promise<void>;
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
  }
}

declare module 'firebase/firestore' {
  export function getFirestore(app?: any): any;
  export function collection(firestore: any, path: string): any;
  export function doc(firestore: any, path: string, ...pathSegments: string[]): any;
  export function setDoc(reference: any, data: any, options?: any): Promise<void>;
  export function getDoc(reference: any): Promise<any>;
  export function getDocs(query: any): Promise<any>;
  export function updateDoc(reference: any, data: any): Promise<void>;
  export function deleteDoc(reference: any): Promise<void>;
  export function query(query: any, ...queryConstraints: any[]): any;
  export function where(fieldPath: string, opStr: string, value: any): any;
  export interface DocumentData {
    [field: string]: any;
  }
  export interface QueryConstraint {
    type: string;
    _apply(query: any): any;
  }
}

declare module 'firebase/analytics' {
  export function getAnalytics(app?: any): any;
  export function isSupported(): Promise<boolean>;
}

// MongoDB custom interfaces - no need to try to import from 'mongodb'

export {};

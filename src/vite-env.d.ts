
/// <reference types="vite/client" />

// Reference types for Firebase modules
/// <reference types="@firebase/app-types" />
/// <reference types="@firebase/auth-types" />
/// <reference types="@firebase/firestore-types" />
/// <reference types="@firebase/storage-types" />

// Create a global namespace for Firebase types
declare namespace Firebase {
  interface Auth {}
  interface User {}
  interface Firestore {}
  interface Storage {}
}

// Explicitly declare module paths for Firebase
declare module 'firebase/app' {
  export * from '@firebase/app-types';
  export function initializeApp(options: any, name?: string): any;
}

declare module 'firebase/auth' {
  export * from '@firebase/auth-types';
  export function getAuth(app?: any): any;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export function onAuthStateChanged(auth: any, nextOrObserver: any): () => void;
  export function updateProfile(user: any, profile: any): Promise<void>;
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore-types';
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
}

declare module 'firebase/analytics' {
  export function getAnalytics(app?: any): any;
  export function isSupported(): Promise<boolean>;
}

// Explicitly declare module for mongodb
declare module 'mongodb' {
  export class MongoClient {
    constructor(uri: string, options?: any);
    connect(): Promise<MongoClient>;
    db(name?: string): Db;
    close(): Promise<void>;
  }
  
  export class Db {
    collection<T>(name: string, options?: any): Collection<T>;
  }
  
  export class Collection<T> {
    insertOne(doc: T): Promise<{ insertedId: ObjectId }>;
    find(query?: any): Cursor<T>;
    findOne(query?: any): Promise<T | null>;
    updateOne(filter: any, update: any): Promise<any>;
    deleteOne(filter: any): Promise<any>;
  }
  
  export class Cursor<T> {
    toArray(): Promise<T[]>;
    sort(sort: any): Cursor<T>;
    limit(limit: number): Cursor<T>;
    skip(skip: number): Cursor<T>;
  }
  
  export class ObjectId {
    constructor(id?: string);
    toString(): string;
  }
}

export {};

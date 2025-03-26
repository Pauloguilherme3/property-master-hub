
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
  
  export interface CollectionOptions {}
  
  export class MongoClient {
    constructor(uri: string, options?: any);
    connect(): Promise<MongoClient>;
    db(name?: string): Db;
    close(): Promise<void>;
  }
  
  export class Db {
    collection<T>(name: string, options?: CollectionOptions): Collection<T>;
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

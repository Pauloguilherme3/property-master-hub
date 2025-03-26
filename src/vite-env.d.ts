
/// <reference types="vite/client" />
/// <reference path="./types/firebase.d.ts" />

// Ensure we properly handle nodejs modules that browser doesn't support natively
declare module 'util' {
  export function promisify<T>(fn: Function): (...args: any[]) => Promise<T>;
}

// Handle MongoDB types - prevents direct import attempts
declare module 'mongodb' {
  export interface ObjectId {
    toString(): string;
  }
  
  export interface Collection<T> {
    insertOne(doc: T): Promise<any>;
    find(query?: any): any;
    findOne(query?: any): Promise<T | null>;
    updateOne(filter: any, update: any): Promise<any>;
    deleteOne(filter: any): Promise<any>;
  }
}

// Mark this file as a module
export {};

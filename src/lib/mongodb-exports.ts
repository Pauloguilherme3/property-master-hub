
// This file serves as a barrel export for MongoDB modules
// It provides browser-compatible MongoDB types and interfaces

// Define MongoDB types for browser compatibility
export interface ObjectId {
  toString(): string;
}

export class ObjectIdImpl implements ObjectId {
  private id: string;

  constructor(id?: string) {
    this.id = id || this.generateId();
  }

  toString(): string {
    return this.id;
  }

  private generateId(): string {
    // Simple implementation to generate a random ID
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// Export the ObjectId implementation
export const ObjectId = ObjectIdImpl;

// Define MongoDB client interfaces
export interface Collection<T> {
  insertOne(doc: T): Promise<{ insertedId: ObjectId }>;
  find(query?: any): Cursor<T>;
  findOne(query?: any): Promise<T | null>;
  updateOne(filter: any, update: any): Promise<any>;
  deleteOne(filter: any): Promise<any>;
}

export interface Cursor<T> {
  toArray(): Promise<T[]>;
  sort(sort: any): Cursor<T>;
  limit(limit: number): Cursor<T>;
  skip(skip: number): Cursor<T>;
}

export interface Db {
  collection<T>(name: string, options?: any): Collection<T>;
}

export interface MongoClient {
  connect(): Promise<MongoClient>;
  db(name?: string): Db;
  close(): Promise<void>;
}

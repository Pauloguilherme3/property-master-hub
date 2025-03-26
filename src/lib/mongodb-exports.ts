
// This file serves as a barrel export for MongoDB modules
// It helps centralize and standardize MongoDB imports across the application

// Re-export from mongodb
export {
  MongoClient,
  Db,
  Collection,
  ObjectId
} from 'mongodb';

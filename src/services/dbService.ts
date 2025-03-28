
// This service now uses Google Sheets as the backend through sheetsService
import { sheetsService } from "./sheetsService";

// Check if Google Sheets service is connected
const checkSheetsConnected = () => {
  if (!sheetsService.isConnectedToSheets()) {
    throw new Error("Google Sheets service is not connected");
  }
};

// Create or update a document
export const setDocument = async (collectionName: string, id: string, data: any) => {
  checkSheetsConnected();
  const collection = sheetsService.getCollection(collectionName);
  return collection.updateOne({ _id: id }, { $set: { ...data, id } });
};

// Get a document by ID
export const getDocument = async (collectionName: string, id: string) => {
  checkSheetsConnected();
  const collection = sheetsService.getCollection(collectionName);
  return collection.findOne({ _id: id });
};

// Get all documents from a collection
export const getCollection = async (collectionName: string) => {
  checkSheetsConnected();
  const collection = sheetsService.getCollection(collectionName);
  return collection.find().toArray();
};

// Query documents with conditions
export const queryDocuments = async (
  collectionName: string, 
  conditions: Record<string, any>
) => {
  checkSheetsConnected();
  const collection = sheetsService.getCollection(collectionName);
  return collection.find(conditions).toArray();
};

// Update a document
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  checkSheetsConnected();
  const collection = sheetsService.getCollection(collectionName);
  const result = await collection.updateOne({ _id: id }, { $set: data });
  return result.modifiedCount > 0;
};

// Delete a document
export const deleteDocument = async (collectionName: string, id: string) => {
  checkSheetsConnected();
  const collection = sheetsService.getCollection(collectionName);
  const result = await collection.deleteOne({ _id: id });
  return result.deletedCount > 0;
};

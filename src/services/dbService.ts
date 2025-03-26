
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  DocumentData,
  QueryConstraint
} from "@/lib/firebase-exports";
import { db } from "@/config/firebase";

// Check if Firebase is initialized before operations
const checkFirebaseInit = () => {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized");
  }
};

// Create or update a document
export const setDocument = async (collectionName: string, id: string, data: any) => {
  checkFirebaseInit();
  const docRef = doc(db, collectionName, id);
  return setDoc(docRef, { ...data, id }, { merge: true });
};

// Get a document by ID
export const getDocument = async (collectionName: string, id: string) => {
  checkFirebaseInit();
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

// Get all documents from a collection
export const getCollection = async (collectionName: string) => {
  checkFirebaseInit();
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Query documents with conditions
export const queryDocuments = async (
  collectionName: string, 
  constraints: QueryConstraint[]
) => {
  checkFirebaseInit();
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Update a document
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  checkFirebaseInit();
  const docRef = doc(db, collectionName, id);
  return updateDoc(docRef, data);
};

// Delete a document
export const deleteDocument = async (collectionName: string, id: string) => {
  checkFirebaseInit();
  const docRef = doc(db, collectionName, id);
  return deleteDoc(docRef);
};

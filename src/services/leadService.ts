
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/config/firebase";

export interface Lead {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  origem: string;
  interesse: string;
  observacoes?: string;
  status: "novo" | "contatado" | "qualificado" | "oportunidade" | "convertido" | "perdido";
  corretorId?: string;
  empreendimentoInteresse?: string[];
  dataCriacao?: any;
  dataAtualizacao?: any;
  ultimoContato?: any;
  proximoContato?: any;
}

// Create a separate type for lead creation that makes status optional
export type LeadCreate = Omit<Lead, "id" | "dataCriacao" | "dataAtualizacao"> & { 
  status?: "novo" | "contatado" | "qualificado" | "oportunidade" | "convertido" | "perdido" 
};

export const addLead = async (leadData: LeadCreate) => {
  try {
    const leadsCollection = collection(db, "leads");
    const docRef = await addDoc(leadsCollection, {
      ...leadData,
      dataCriacao: serverTimestamp(),
      dataAtualizacao: serverTimestamp(),
      status: leadData.status || "novo"
    });
    return { id: docRef.id, ...leadData };
  } catch (error) {
    console.error("Error adding lead:", error);
    throw error;
  }
};

export const updateLead = async (id: string, leadData: Partial<Lead>) => {
  try {
    const leadRef = doc(db, "leads", id);
    await updateDoc(leadRef, {
      ...leadData,
      dataAtualizacao: serverTimestamp()
    });
    return { id, ...leadData };
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const deleteLead = async (id: string) => {
  try {
    const leadRef = doc(db, "leads", id);
    await deleteDoc(leadRef);
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};

export const getLeads = async (filters: any = {}) => {
  try {
    let leadsQuery = collection(db, "leads");
    let queryConstraints = [];
    
    if (filters.status) {
      queryConstraints.push(where("status", "==", filters.status));
    }
    
    if (filters.corretorId) {
      queryConstraints.push(where("corretorId", "==", filters.corretorId));
    }
    
    if (filters.origem) {
      queryConstraints.push(where("origem", "==", filters.origem));
    }
    
    // Always order by creation date
    queryConstraints.push(orderBy("dataCriacao", "desc"));
    
    const q = query(leadsQuery, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataCriacao: doc.data().dataCriacao?.toDate() || null,
      dataAtualizacao: doc.data().dataAtualizacao?.toDate() || null,
      ultimoContato: doc.data().ultimoContato?.toDate() || null,
      proximoContato: doc.data().proximoContato?.toDate() || null
    })) as Lead[];
  } catch (error) {
    console.error("Error getting leads:", error);
    throw error;
  }
};

export const registrarContatoLead = async (id: string, observacoes: string) => {
  try {
    const leadRef = doc(db, "leads", id);
    await updateDoc(leadRef, {
      ultimoContato: serverTimestamp(),
      observacoes: observacoes,
      dataAtualizacao: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error registering lead contact:", error);
    throw error;
  }
};

export const atribuirCorretorLead = async (id: string, corretorId: string) => {
  try {
    const leadRef = doc(db, "leads", id);
    await updateDoc(leadRef, {
      corretorId: corretorId,
      dataAtualizacao: serverTimestamp(),
      status: "contatado"
    });
    return true;
  } catch (error) {
    console.error("Error assigning lead to agent:", error);
    throw error;
  }
};

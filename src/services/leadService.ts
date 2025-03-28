
import { googleSheetsService } from "@/services/googleSheetsService";

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
  dataCriacao?: Date;
  dataAtualizacao?: Date;
  ultimoContato?: Date;
  proximoContato?: Date;
}

// Create a separate type for lead creation that makes all fields optional for the form
export type LeadCreate = Partial<Lead>;

export const addLead = async (leadData: LeadCreate) => {
  try {
    await googleSheetsService.connect();
    
    const now = new Date();
    const leadToInsert = {
      nome: leadData.nome || "",
      email: leadData.email || "",
      telefone: leadData.telefone || "",
      origem: leadData.origem || "",
      interesse: leadData.interesse || "",
      observacoes: leadData.observacoes,
      status: leadData.status || "novo",
      corretorId: leadData.corretorId,
      empreendimentoInteresse: leadData.empreendimentoInteresse,
      dataCriacao: now,
      dataAtualizacao: now
    };
    
    const result = await googleSheetsService.addDocument("leads", leadToInsert);
    return result;
  } catch (error) {
    console.error("Error adding lead:", error);
    throw error;
  }
};

export const updateLead = async (id: string, leadData: Partial<Lead>) => {
  try {
    await googleSheetsService.connect();
    
    const updateData = {
      ...leadData,
      dataAtualizacao: new Date()
    };
    
    await googleSheetsService.updateDocument("leads", id, updateData);
    
    return { id, ...leadData };
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const deleteLead = async (id: string) => {
  try {
    await googleSheetsService.connect();
    
    await googleSheetsService.deleteDocument("leads", id);
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};

export const getLeads = async (filters: any = {}) => {
  try {
    await googleSheetsService.connect();
    
    let query: any = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.corretorId) {
      query.corretorId = filters.corretorId;
    }
    
    if (filters.origem) {
      query.origem = filters.origem;
    }
    
    const leads = await googleSheetsService.queryDocuments<Lead>("leads", query);
    
    // Sort by creation date (newest first)
    leads.sort((a, b) => {
      const dateA = a.dataCriacao instanceof Date ? a.dataCriacao : new Date(a.dataCriacao as any);
      const dateB = b.dataCriacao instanceof Date ? b.dataCriacao : new Date(b.dataCriacao as any);
      return dateB.getTime() - dateA.getTime();
    });
    
    return leads;
  } catch (error) {
    console.error("Error getting leads:", error);
    throw error;
  }
};

export const registrarContatoLead = async (id: string, observacoes: string) => {
  try {
    await googleSheetsService.connect();
    
    await googleSheetsService.updateDocument("leads", id, { 
      ultimoContato: new Date(),
      observacoes: observacoes,
      dataAtualizacao: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error registering lead contact:", error);
    throw error;
  }
};

export const atribuirCorretorLead = async (id: string, corretorId: string) => {
  try {
    await googleSheetsService.connect();
    
    await googleSheetsService.updateDocument("leads", id, { 
      corretorId: corretorId,
      dataAtualizacao: new Date(),
      status: "contatado"
    });
    
    return true;
  } catch (error) {
    console.error("Error assigning lead to agent:", error);
    throw error;
  }
};

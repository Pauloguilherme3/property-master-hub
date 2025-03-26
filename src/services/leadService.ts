
import { mongoDBService } from "@/services/mongoService";
import { ObjectId } from "@/lib/mongodb-exports";

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

// Type for MongoDB document
type LeadDocument = Omit<Lead, "id"> & { _id?: ObjectId };

export const addLead = async (leadData: LeadCreate) => {
  try {
    await mongoDBService.connect();
    const collection = mongoDBService.getCollection<LeadDocument>("leads");
    
    const now = new Date();
    const leadToInsert: LeadDocument = {
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
    
    const result = await collection.insertOne(leadToInsert);
    return { 
      id: result.insertedId.toString(),
      ...leadToInsert
    };
  } catch (error) {
    console.error("Error adding lead:", error);
    throw error;
  }
};

export const updateLead = async (id: string, leadData: Partial<Lead>) => {
  try {
    await mongoDBService.connect();
    const collection = mongoDBService.getCollection<LeadDocument>("leads");
    
    const updateData: Partial<LeadDocument> = {
      ...leadData,
      dataAtualizacao: new Date()
    };
    
    // Remove id field if present as MongoDB uses _id
    if ('id' in updateData) {
      delete updateData.id;
    }
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return { id, ...leadData };
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const deleteLead = async (id: string) => {
  try {
    await mongoDBService.connect();
    const collection = mongoDBService.getCollection<LeadDocument>("leads");
    
    await collection.deleteOne({ _id: new ObjectId(id) });
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};

export const getLeads = async (filters: any = {}) => {
  try {
    await mongoDBService.connect();
    const collection = mongoDBService.getCollection<LeadDocument>("leads");
    
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
    
    const leads = await collection.find(query).sort({ dataCriacao: -1 }).toArray();
    
    return leads.map(lead => ({
      id: lead._id?.toString(),
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      origem: lead.origem,
      interesse: lead.interesse,
      observacoes: lead.observacoes,
      status: lead.status,
      corretorId: lead.corretorId,
      empreendimentoInteresse: lead.empreendimentoInteresse,
      dataCriacao: lead.dataCriacao,
      dataAtualizacao: lead.dataAtualizacao,
      ultimoContato: lead.ultimoContato,
      proximoContato: lead.proximoContato
    })) as Lead[];
  } catch (error) {
    console.error("Error getting leads:", error);
    throw error;
  }
};

export const registrarContatoLead = async (id: string, observacoes: string) => {
  try {
    await mongoDBService.connect();
    const collection = mongoDBService.getCollection<LeadDocument>("leads");
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ultimoContato: new Date(),
          observacoes: observacoes,
          dataAtualizacao: new Date()
        } 
      }
    );
    
    return true;
  } catch (error) {
    console.error("Error registering lead contact:", error);
    throw error;
  }
};

export const atribuirCorretorLead = async (id: string, corretorId: string) => {
  try {
    await mongoDBService.connect();
    const collection = mongoDBService.getCollection<LeadDocument>("leads");
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          corretorId: corretorId,
          dataAtualizacao: new Date(),
          status: "contatado"
        } 
      }
    );
    
    return true;
  } catch (error) {
    console.error("Error assigning lead to agent:", error);
    throw error;
  }
};

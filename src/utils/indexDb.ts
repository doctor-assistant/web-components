import Dexie from "dexie";
import state from "../store";
import { ConsultationReportSchema } from "../components/entities/consultation.entity";
interface Specialty {
  id: string;
  title: string;
}
interface ProfessionalSpecialty {
  professionalId: string;
  specialtyId: string;
}

interface Consultation {
  id?: number;
  professionalId: string;
  specialty: string;
  audioBlob: any;
  metadata: any
}
class SpecialtiesDB extends Dexie {
  specialties: Dexie.Table<Specialty, string>;

  constructor() {
    super("specialtiesDb");
    this.version(1).stores({
      specialties: "id, title",
    });
    this.specialties = this.table("specialties");
  }
}

const specialtiesDb = new SpecialtiesDB();

export async function saveSpecialties(data: Specialty[]) {
  try {
    await specialtiesDb.transaction("rw", specialtiesDb.specialties, async () => {
      for (let item of data) {
        await specialtiesDb.specialties.put({ id: item.id, title: item.title });
      }
    });
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
  }
}

class ProfessionalDB extends Dexie {
  professionalSpecialties: Dexie.Table<ProfessionalSpecialty, string>;

  constructor() {
    super("professionalDb");
    this.version(1).stores({
      professionalSpecialties: "++id, professionalId, specialtyId",
    });
    this.professionalSpecialties = this.table("professionalSpecialties");
  }
}

const professionalDb = new ProfessionalDB();

/**
 * Salva uma relação entre um `professionalId` e uma `specialtyId`
 */
export async function saveSpecialtyByProfessionalId(
  professionalId: string,
  specialtyId: string
) {
  try {
    await professionalDb.transaction(
      "rw",
      professionalDb.professionalSpecialties,
      async () => {
        await professionalDb.professionalSpecialties.put({
          professionalId,
          specialtyId,
        });
      }
    );
  } catch (error) {
    console.error("Erro ao salvar a relação:", error);
  }
}


export async function getSpecialtiesByProfessionalId(professionalId: string): Promise<{
  specialtiesAsStrings: string[];
  mostRecentSpecialty: { id: string; title: string } | null;
}> {
  try {
    const relations = await professionalDb.professionalSpecialties
      .where("professionalId")
      .equals(professionalId)
      .toArray();

    if (relations.length === 0) {
      return { specialtiesAsStrings: [], mostRecentSpecialty: null };
    }

    const specialtyIds = relations.map((r) => r.specialtyId);

    const specialties = await specialtiesDb.specialties
      .where("id")
      .anyOf(specialtyIds)
      .toArray();

    const specialtiesAsStrings = specialties.map((s) => `${s.id}: ${s.title}`);

    const mostRecentRelation = relations[relations.length - 1];
    const mostRecentSpecialty = specialties.find(
      (s) => s.id === mostRecentRelation.specialtyId
    ) || null;

    state.specialtyTitle = mostRecentSpecialty.title
    state.chooseSpecialty = mostRecentSpecialty.id

    return {
      specialtiesAsStrings,
      mostRecentSpecialty,
    };
  } catch (error) {
    console.error(
      `Erro ao recuperar especialidades para professionalId=${professionalId}:`,
      error
    );
    return { specialtiesAsStrings: [], mostRecentSpecialty: null };
  }
}


interface ChunkUpload {
  id: string;
  consultationId: string;
  recordingId: string;
  chunk: Blob;
  duration: number;
  index: number;
  retryCount: number;
  timestamp: number;
  specialty: string;
  reportSchema?: ConsultationReportSchema;
}

class ChunkUploadDB extends Dexie {
  chunks: Dexie.Table<ChunkUpload, number>;

  constructor() {
    super("chunkUploadDb");
    this.version(1).stores({
      chunks: "++id,consultationId,recordingId,chunk,duration,index,retryCount,timestamp,specialty,reportSchema"
    });
    this.chunks = this.table("chunks");
  }
}

const chunkUploadDb = new ChunkUploadDB();

class ConsusltationDb extends Dexie {
  consultations: Dexie.Table<Consultation, string>;

  constructor() {
    super("consultationDb");
    this.version(1).stores({
      consultations: "++id,professionalId,specialty,audio,metadata",
    });
    this.consultations = this.table("consultations");
  }
}

const consultationDb = new ConsusltationDb();

export async function saveConsultation(professionalId: string, audioBlob: any, specialty: string, metadata: any) {
  try {
    await consultationDb.transaction(
      "rw",
      consultationDb.consultations,
      async () => {
        await consultationDb.consultations.add({
          professionalId,
          audioBlob,
          specialty,
          metadata,
        });
      }
    );
  } catch (error) {
    console.error("Erro ao salvar a relação:", error);
  }
}

export async function getConsultation() {
  try {
    return await consultationDb.consultations
      .toArray();
  } catch (error) {
    console.error("Erro ao buscar as consultas:", error);
    return [];
  }
}

export async function getConsultationsByProfessional(professionalId: string) {
  try {
    return await consultationDb.consultations
      .where("professionalId")
      .equals(professionalId)
      .toArray();
  } catch (error) {
    console.error("Erro ao buscar as consultas:", error);
    return [];
  }
}


export async function deleteConsultationById(professionalId: string, id: number) {
  try {
    await consultationDb.transaction("rw", consultationDb.consultations, async () => {
      const deletedCount = await consultationDb.consultations
        .where({ professionalId, id }) // Filtra pelo professionalId e id
        .delete();

      if (deletedCount > 0) {
        console.warn(`Consulta com ID ${id} do profissional ${professionalId} foi deletada.`);
      } else {
        console.warn(`Nenhuma consulta encontrada para o ID ${id} e profissional ${professionalId}.`);
      }
    });
  } catch (error) {
    console.error("Erro ao deletar a consulta:", error);
  }
}

export async function saveChunk(chunk: ChunkUpload) {
  try {
    await chunkUploadDb.transaction("rw", chunkUploadDb.chunks, async () => {
      await chunkUploadDb.chunks.add({
        ...chunk,
        retryCount: chunk.retryCount || 0,
        timestamp: chunk.timestamp || Date.now()
      });
    });
  } catch (error) {
    console.error("Erro ao salvar chunk:", error);
  }
}

export async function getFailedChunksBydId(consultationId: string) {
  try {
    return await chunkUploadDb.chunks
      .where("consultationId")
      .equals(consultationId)
      .sortBy("timestamp");
  } catch (error) {
    console.error("Erro ao buscar chunks:", error);
    return [];
  }
}

export async function getFailedChunks() {
  try {
    return await chunkUploadDb.chunks.toArray();
  } catch (error) {
    console.error("Erro ao buscar chunks:", error);
    return [];
  }
}

export async function deleteChunk(id: string) {
  try {
    await chunkUploadDb.transaction("rw", chunkUploadDb.chunks, async () => {
      const deletedCount = await chunkUploadDb.chunks
        .where("id")
        .equals(id)
        .delete();

      if (deletedCount > 0) {
        console.warn(`Chunk com ID ${id} foi deletado.`);
      } else {
        console.warn(`Nenhum chunk encontrado para o ID ${id}.`);
      }
    });
  } catch (error) {
    console.error("Erro ao deletar chunk:", error);
  }
}


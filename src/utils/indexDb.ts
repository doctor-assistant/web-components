import Dexie from "dexie";
import state from "../store";

interface Specialty {
  id: string;
  title: string;
}

interface ProfessionalSpecialty {
  professionalId: string;
  specialtyId: string;
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


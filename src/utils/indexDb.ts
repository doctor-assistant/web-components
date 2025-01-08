import Dexie from 'dexie';

interface Specialty {
  id: string;
  title: string;
}

class SpecialtiesDB extends Dexie {
  specialties: Dexie.Table<Specialty, string>;
  constructor() {
    super("specialtiesDb");
    this.version(1).stores({
      specialties: 'id, title'
    });
    this.specialties = this.table("specialties");
  }
}

const specialtiesDb = new SpecialtiesDB();

export async function saveSpecialties(data: Specialty[]) {
  try {
    await specialtiesDb.transaction(
      'rw',
      specialtiesDb.specialties,
      async () => {
        for (let item of data) {
          await specialtiesDb.specialties.put({ id: item.id, title: item.title });
        }
      }
    );
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
  }
}
export async function getSpecialtyTitleById(id: string): Promise<string | null> {
  try {
    const specialty = await specialtiesDb.specialties.get(id);

    if (specialty) {
      return specialty.title;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar a especialidade:', error);
    return null;
  }
}



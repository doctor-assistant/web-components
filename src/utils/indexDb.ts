//@ts-ignore
import Dexie from "https://cdn.jsdelivr.net/npm/dexie@3.2.3/dist/dexie.mjs";

export const professionalDb = new Dexie("professional");
export const specialtiesDb = new Dexie("specialties");

professionalDb.version(1).stores({
  professional_info: "++id, professionalId, specialty",
});

specialtiesDb.version(1).stores({
    specialties: 'key, title'
  });

export async function saveSpecialties(data) {
  console.log('## data ##',data)
  try {
    await specialtiesDb.transaction(
      'rw',
      specialtiesDb.specialties,
      async () => {
        for (const value of Object.entries(data)) {
          //@ts-ignore
         console.log('### value ###', value[1].id)
          // await specialtiesDb.specialties.put();
        }
      }
    );
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
  }
}

export async function getSpecialtyTitle(specialtyKey: string) {
  try {
    const specialty = await specialtiesDb.specialties.get(specialtyKey);
    console.log(specialty,'specialty - index')
    if (specialty) {
      return specialty.title;
    }
  } catch (error) {
    console.error('Erro ao buscar a especialidade:', error);
    return null;
  }
}

import state from "../store";

async function getSpecialtyApi(mode: string) {
  const url =
    mode === "dev"
      ? "https://apim.doctorassistant.ai/api/sandbox/specialties"
      : "https://apim.doctorassistant.ai/api/production/specialties";

  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      console.error(
        "Erro na requisição:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Erro ao carregar as especialidades", error);
  }
}

export async function getSpecialty(mode:string) {
  try {
    const jsonResponse = await getSpecialtyApi(mode);
    if (jsonResponse && jsonResponse.specialties) {
      const specialties = Object.entries(jsonResponse.specialties).map(
        //@ts-ignore
        ([key, { title }]) => ({
          id: key,
          title,
        })
      );

      state.specialtyList = specialties;
      return specialties
    }
  } catch (error) {
    console.error("Erro ao carregar as especialidades", error);
  }
}

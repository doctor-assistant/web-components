import { ConsultationPrescriptionDataMEMED, ConsultationResponse } from "../../entities/consultation.entity";

const loadMemedScript = (token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded and remove it to reconfigure
    const existingScript = document.querySelector(
      'script[src*="sinapse-prescricao"]'
    ) as HTMLScriptElement;

    if (existingScript) {
      console.info("Script Memed existente encontrado. Removendo para reconfiguração...");

      // Remove existing script from DOM
      existingScript.remove();

      // Clean up global objects if they exist
      type WindowWithMemed = typeof window & {
        MdSinapsePrescricao?: any;
        MdHub?: any;
      };
      const win = window as WindowWithMemed;

      // Clear global objects to allow reinitialization
      if (typeof win.MdSinapsePrescricao !== "undefined") {
        delete (win as any).MdSinapsePrescricao;
      }
      if (typeof win.MdHub !== "undefined") {
        delete (win as any).MdHub;
      }
    }

    // Create and load script with new configuration
    const script = document.createElement('script');
    script.src = "https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js";
    script.setAttribute('data-token', token);

    // Ensure script is loaded in the global document context (not shadow DOM)
    // This prevents CORS errors by ensuring the script runs in the correct context
    script.onload = () => {
      console.log("Script Memed carregado com sucesso");
      resolve();
    };

    script.onerror = (error) => {
      console.error("Erro ao carregar script Memed", error);
      reject(new Error("Falha ao carregar script da Memed"));
    };

    // Append to document head or body (global context)
    // Using document.head ensures the script is in the global context, avoiding Shadow DOM issues
    const targetElement = document.head || document.body || document.documentElement;
    targetElement.appendChild(script);
  });
};

const initializeMemedIntegration = async (consultation: ConsultationResponse, prescriptionData: ConsultationPrescriptionDataMEMED): Promise<void> => {
  type WindowWithMemed = typeof window & {
    MdSinapsePrescricao?: any;
    MdHub?: any;
  };
  const win = window as WindowWithMemed;

  // Wait for MdSinapsePrescricao to be available
  let retries = 0;
  const maxRetries = 10;

  while (typeof win.MdSinapsePrescricao === "undefined" && retries < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Aguardando inicialização do MdSinapsePrescricao", retries);
    retries++;
  }

  if (typeof win.MdSinapsePrescricao === "undefined") {
    console.error("MdSinapsePrescricao não foi inicializado após múltiplas tentativas");
    return;
  }


  // Wait for platform.voice-prescription module to initialize
  return new Promise((resolve) => {
    win.MdSinapsePrescricao.event.add("core:moduleInit", function (module: any) {
      if (module.name === "platform.voice-prescription") {
        console.log("Módulo Voice Prescription inicializado");

        // Extract medications from medical prescription
        const medicalPrescription = (consultation.report as any)?.medicalPrescription?.medications?.content;
        const medications = Array.isArray(medicalPrescription)
          ? medicalPrescription.map((med: { dose: string, name: string, usage: string }) => ({
            medication: `${med?.name} ${med?.dose}`,
            dosageInstruction: med?.usage || ''
          }))
          : [];

        // Set patient data
        if (win.MdHub && prescriptionData?.patient) {
          const patient = prescriptionData.patient;
          win.MdHub.command.send("plataforma.prescricao", "setPaciente", {
            idExterno: patient.externalId,
            nome: patient.name,
            telefone: patient.phone,
            email: patient.email,
            ...(patient.document
              ? { cpf: patient.document }
              : { withoutCpf: true }
            ),
          });
        }

        // Set medications
        if (win.MdHub && medications.length > 0) {
          win.MdHub.command.send("platform.voice-prescription", "setMedications", {
            items: medications,
          });

          // Open voice prescription view
          win.MdHub.command.send("platform.voice-prescription", "viewVoicePrescription");
        }

        resolve();
      }
    });
  });
};

export { loadMemedScript, initializeMemedIntegration };
/**
 * Utilitário para integração com o SDK da Memed - Voice Prescription
 * Encapsula o carregamento dinâmico e métodos de interação com a plataforma
 */

// Tipagem para dados do paciente Memed
export interface MemedPaciente {
  idExterno: string;
  nome: string;
  cpf?: string;
  data_nascimento?: string;
  nome_social?: string;
  endereco?: string;
  cidade?: string;
  telefone: string;
  peso?: number;
  altura?: number;
  nome_mae?: string;
  dificuldade_locomocao?: boolean;
  email?: string;
  withoutCpf?: boolean;
}

// Tipagem para medicamentos
export interface MemedMedicationItem {
  medication: string;
  dosageInstruction?: string;
}

// Tipagem para resposta do comando
export interface MemedCommandResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Declaração global para o SDK da Memed
declare global {
  interface Window {
    MdHub?: {
      command: {
        send: (module: string, command: string, data?: any) => Promise<MemedCommandResponse>;
      };
      module: {
        show: (moduleName: string) => void;
        hide: (moduleName: string) => void;
      };
    };
    MdSinapsePrescricao?: {
      event: {
        add: (event: string, callback: (module: any) => void) => void;
      };
    };
  }
}

// Tipos de módulos disponíveis
export type MemedModuleType = 'plataforma.prescricao' | 'platform.voice-prescription';

// Flag para controlar carregamento único do script
let isScriptLoaded = false;
let isModuleInitialized = false;
let isPrescriptionModuleInitialized = false;
let isVoicePrescriptionModuleInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Carrega dinamicamente o script da Memed se ainda não foi carregado
 * @param token Token de autenticação da Memed
 * @returns Promise que resolve quando o script é carregado
 */
export const loadMemedScript = (token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verifica se o script já foi carregado
    if (isScriptLoaded) {
      resolve();
      return;
    }

    // Verifica se já existe um script com o token
    const existingScript = document.querySelector(`script[data-token="${token}"]`);
    if (existingScript) {
      isScriptLoaded = true;
      resolve();
      return;
    }

    // Cria e adiciona o script
    const script = document.createElement('script');
    script.src = 'https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js';
    script.setAttribute('data-token', token);
    script.setAttribute('data-memed-loaded', 'true');

    script.onload = () => {
      isScriptLoaded = true;
      console.log('Script da Memed carregado com sucesso');
      resolve();
    };

    script.onerror = () => {
      const error = 'Erro ao carregar script da Memed';
      console.error(error);
      reject(new Error(error));
    };

    document.head.appendChild(script);
  });
};

/**
 * Aguarda a inicialização de um módulo específico da Memed
 * @param moduleName Nome do módulo a aguardar ('plataforma.prescricao' ou 'platform.voice-prescription')
 * @returns Promise que resolve quando o módulo está inicializado
 */
export const waitForModuleInitialization = (moduleName: MemedModuleType = 'plataforma.prescricao'): Promise<void> => {
  return new Promise((resolve) => {
    // Verifica se o módulo já foi inicializado
    if (moduleName === 'plataforma.prescricao' && isPrescriptionModuleInitialized) {
      resolve();
      return;
    }

    if (moduleName === 'platform.voice-prescription' && isVoicePrescriptionModuleInitialized) {
      resolve();
      return;
    }

    if (window.MdSinapsePrescricao) {
      window.MdSinapsePrescricao.event.add('core:moduleInit', (module: any) => {
        if (module.name === moduleName) {
          if (moduleName === 'plataforma.prescricao') {
            isPrescriptionModuleInitialized = true;
            console.log('Módulo Plataforma Prescrição inicializado');
          } else if (moduleName === 'platform.voice-prescription') {
            isVoicePrescriptionModuleInitialized = true;
            console.log('Módulo Voice Prescription inicializado');
          }

          isModuleInitialized = true;
          resolve();
        }
      });
    } else {
      // Fallback: aguarda um tempo e tenta novamente
      setTimeout(() => {
        waitForModuleInitialization(moduleName).then(resolve);
      }, 100);
    }
  });
};

/**
 * Inicializa o SDK da Memed com token
 * @param token Token de autenticação
 * @param moduleName Nome do módulo a inicializar (padrão: 'plataforma.prescricao')
 * @returns Promise que resolve quando o SDK está pronto
 */
export const initializeMemed = (token: string, moduleName: MemedModuleType = 'plataforma.prescricao'): Promise<void> => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      await loadMemedScript(token);
      await waitForModuleInitialization(moduleName);
    } catch (error) {
      initializationPromise = null; // Reset para permitir nova tentativa
      throw error;
    }
  })();

  return initializationPromise;
};

/**
 * Define os dados do paciente no SDK da Memed
 * @param paciente Dados do paciente
 * @returns Promise com resposta do comando
 */
export const setPaciente = async (paciente: MemedPaciente): Promise<MemedCommandResponse> => {
  if (!window.MdHub) {
    throw new Error('SDK da Memed não está disponível. Certifique-se de que foi inicializado.');
  }

  try {
    const response = await window.MdHub.command.send('plataforma.prescricao', 'setPaciente', paciente);
    console.log('Dados do paciente definidos:', response);
    return response;
  } catch (error) {
    console.error('Erro ao definir paciente:', error);
    throw error;
  }
};

/**
 * Define os medicamentos no SDK da Memed
 * @param items Array de medicamentos
 * @returns Promise com resposta do comando
 */
export const setMedications = async (items: MemedMedicationItem[]): Promise<MemedCommandResponse> => {
  if (!window.MdHub) {
    throw new Error('SDK da Memed não está disponível. Certifique-se de que foi inicializado.');
  }

  try {
    const response = await window.MdHub.command.send('platform.voice-prescription', 'setMedications', {
      items
    });
    console.log('Medicamentos definidos:', response);
    return response;
  } catch (error) {
    console.error('Erro ao definir medicamentos:', error);
    throw error;
  }
};

/**
 * Exibe o módulo de prescrição usando MdHub.module.show()
 * Usado para prescrição tradicional (plataforma.prescricao)
 */
export const showPrescription = (): void => {
  if (!window.MdHub) {
    throw new Error('SDK da Memed não está disponível. Certifique-se de que foi inicializado.');
  }

  try {
    window.MdHub.module.show('plataforma.prescricao');
    console.log('Módulo de prescrição exibido');
  } catch (error) {
    console.error('Erro ao exibir módulo de prescrição:', error);
    throw error;
  }
};

/**
 * Oculta o módulo de prescrição usando MdHub.module.hide()
 */
export const hidePrescription = (): void => {
  if (!window.MdHub) {
    throw new Error('SDK da Memed não está disponível. Certifique-se de que foi inicializado.');
  }

  try {
    window.MdHub.module.hide('plataforma.prescricao');
    console.log('Módulo de prescrição ocultado');
  } catch (error) {
    console.error('Erro ao ocultar módulo de prescrição:', error);
    throw error;
  }
};

/**
 * Abre a interface de prescrição da Memed (Voice Prescription)
 * @returns Promise com resposta do comando
 */
export const viewVoicePrescription = async (): Promise<MemedCommandResponse> => {
  if (!window.MdHub) {
    throw new Error('SDK da Memed não está disponível. Certifique-se de que foi inicializado.');
  }

  try {
    const response = await window.MdHub.command.send('platform.voice-prescription', 'viewVoicePrescription');
    console.log('Interface de prescrição aberta:', response);
    return response;
  } catch (error) {
    console.error('Erro ao abrir interface de prescrição:', error);
    throw error;
  }
};

/**
 * Função bootstrap para prescrição tradicional (plataforma.prescricao)
 * Fluxo: Inicializa SDK → Define paciente → Exibe prescrição
 * @param token Token de autenticação
 * @param paciente Dados do paciente
 * @returns Promise que resolve quando todo o fluxo é executado
 */
export const bootstrapPrescription = async (
  token: string,
  paciente: MemedPaciente
): Promise<void> => {
  try {
    console.log('Iniciando bootstrap da prescrição tradicional Memed...');

    // 1. Inicializa o SDK com módulo plataforma.prescricao
    await initializeMemed(token, 'plataforma.prescricao');

    // 2. Define o paciente
    await setPaciente(paciente);

    // 3. Exibe o módulo de prescrição
    showPrescription();

    console.log('Bootstrap da prescrição tradicional concluído com sucesso');
  } catch (error) {
    console.error('Erro no bootstrap da prescrição tradicional:', error);
    throw error;
  }
};

/**
 * Função bootstrap para Voice Prescription (platform.voice-prescription)
 * Fluxo: Inicializa SDK → Define paciente → Define medicamentos → Abre interface
 * @param token Token de autenticação
 * @param paciente Dados do paciente
 * @param items Array de medicamentos
 * @returns Promise que resolve quando todo o fluxo é executado
 */
export const bootstrapMemed = async (
  token: string,
  paciente: MemedPaciente,
  items: MemedMedicationItem[]
): Promise<void> => {
  try {
    console.log('Iniciando bootstrap do Voice Prescription...');

    // 1. Inicializa o SDK com módulo platform.voice-prescription
    await initializeMemed(token, 'platform.voice-prescription');

    // 2. Define o paciente
    await setPaciente(paciente);

    // 3. Define os medicamentos
    await setMedications(items);

    // 4. Abre a interface
    await viewVoicePrescription();

    console.log('Bootstrap do Voice Prescription concluído com sucesso');
  } catch (error) {
    console.error('Erro no bootstrap do Voice Prescription:', error);
    throw error;
  }
};

/**
 * Verifica se o SDK da Memed está disponível
 * @returns boolean indicando se o SDK está carregado
 */
export const isMemedAvailable = (): boolean => {
  return !!(window.MdHub && window.MdSinapsePrescricao && isModuleInitialized);
};

/**
 * Reseta o estado do SDK (útil para testes)
 */
export const resetMemedState = (): void => {
  isScriptLoaded = false;
  isModuleInitialized = false;
  isPrescriptionModuleInitialized = false;
  isVoicePrescriptionModuleInitialized = false;
  initializationPromise = null;
};

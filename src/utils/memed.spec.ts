import {
  loadMemedScript,
  waitForModuleInitialization,
  setPaciente,
  setMedications,
  viewVoicePrescription,
  bootstrapMemed,
  isMemedAvailable,
  resetMemedState,
  parseMedicationsFromReport,
  MemedPaciente,
  MemedMedicationItem
} from './memed';

// Mock do DOM
const mockScript = {
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
  src: '',
  setAttribute: jest.fn(),
};

// Mock do document
Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => mockScript),
  writable: true,
});

Object.defineProperty(document, 'querySelector', {
  value: jest.fn(() => null),
  writable: true,
});

Object.defineProperty(document.head, 'appendChild', {
  value: jest.fn(),
  writable: true,
});

// Mock do window
Object.defineProperty(window, 'MdHub', {
  value: {
    command: {
      send: jest.fn()
    }
  },
  writable: true,
});

Object.defineProperty(window, 'MdSinapsePrescricao', {
  value: {
    event: {
      add: jest.fn()
    }
  },
  writable: true,
});

describe('Memed Utils', () => {
  beforeEach(() => {
    resetMemedState();
    jest.clearAllMocks();
  });

  describe('loadMemedScript', () => {
    it('should load script successfully', async () => {
      const token = 'test-token';

      const promise = loadMemedScript(token);

      // Simula o carregamento bem-sucedido
      if (mockScript.onload) {
        mockScript.onload();
      }

      await promise;

      expect(document.createElement).toHaveBeenCalledWith('script');
      expect(mockScript.setAttribute).toHaveBeenCalledWith('data-token', token);
      expect(mockScript.setAttribute).toHaveBeenCalledWith('data-memed-loaded', 'true');
      expect(document.head.appendChild).toHaveBeenCalledWith(mockScript);
    });

    it('should reject on script load error', async () => {
      const token = 'test-token';

      const promise = loadMemedScript(token);

      // Simula erro no carregamento
      if (mockScript.onerror) {
        mockScript.onerror();
      }

      await expect(promise).rejects.toThrow('Erro ao carregar script da Memed');
    });

    it('should not load script if already loaded', async () => {
      const token = 'test-token';

      // Primeira chamada
      const promise1 = loadMemedScript(token);
      if (mockScript.onload) {
        mockScript.onload();
      }
      await promise1;

      // Segunda chamada - não deve criar novo script
      const promise2 = loadMemedScript(token);
      await promise2;

      expect(document.createElement).toHaveBeenCalledTimes(1);
    });
  });

  describe('waitForModuleInitialization', () => {
    it('should resolve when module is initialized', async () => {
      const mockCallback = jest.fn();
      (window.MdSinapsePrescricao!.event.add as jest.Mock).mockImplementation((event, callback) => {
        if (event === 'core:moduleInit') {
          mockCallback.mockImplementation(callback);
        }
      });

      const promise = waitForModuleInitialization();

      // Simula inicialização do módulo
      mockCallback({ name: 'platform.voice-prescription' });

      await promise;

      expect(window.MdSinapsePrescricao!.event.add).toHaveBeenCalledWith(
        'core:moduleInit',
        expect.any(Function)
      );
    });
  });

  describe('setPaciente', () => {
    it('should send setPaciente command', async () => {
      const paciente: MemedPaciente = {
        idExterno: '12345',
        nome: 'João Silva',
        telefone: '11999999999'
      };

      const mockResponse = { success: true, data: 'Paciente definido' };
      (window.MdHub!.command.send as jest.Mock).mockResolvedValue(mockResponse);

      const result = await setPaciente(paciente);

      expect(window.MdHub!.command.send).toHaveBeenCalledWith(
        'plataforma.prescricao',
        'setPaciente',
        paciente
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error if MdHub is not available', async () => {
      // @ts-ignore
      window.MdHub = undefined;

      const paciente: MemedPaciente = {
        idExterno: '12345',
        nome: 'João Silva',
        telefone: '11999999999'
      };

      await expect(setPaciente(paciente)).rejects.toThrow(
        'SDK da Memed não está disponível. Certifique-se de que foi inicializado.'
      );
    });
  });

  describe('setMedications', () => {
    it('should send setMedications command', async () => {
      const items: MemedMedicationItem[] = [
        { medication: 'Dipirona 500mg', dosageInstruction: 'Tomar 1 comprimido a cada 6 horas' }
      ];

      const mockResponse = { success: true, data: 'Medicamentos definidos' };
      (window.MdHub!.command.send as jest.Mock).mockResolvedValue(mockResponse);

      const result = await setMedications(items);

      expect(window.MdHub!.command.send).toHaveBeenCalledWith(
        'platform.voice-prescription',
        'setMedications',
        { items }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('viewVoicePrescription', () => {
    it('should send viewVoicePrescription command', async () => {
      const mockResponse = { success: true, data: 'Interface aberta' };
      (window.MdHub!.command.send as jest.Mock).mockResolvedValue(mockResponse);

      const result = await viewVoicePrescription();

      expect(window.MdHub!.command.send).toHaveBeenCalledWith(
        'platform.voice-prescription',
        'viewVoicePrescription'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('bootstrapMemed', () => {
    it('should execute complete bootstrap flow', async () => {
      const token = 'test-token';
      const paciente: MemedPaciente = {
        idExterno: '12345',
        nome: 'João Silva',
        telefone: '11999999999'
      };
      const items: MemedMedicationItem[] = [
        { medication: 'Dipirona 500mg', dosageInstruction: 'Tomar 1 comprimido a cada 6 horas' }
      ];

      // Mock das funções
      jest.spyOn(require('./memed'), 'loadMemedScript').mockResolvedValue(undefined);
      jest.spyOn(require('./memed'), 'waitForModuleInitialization').mockResolvedValue(undefined);
      jest.spyOn(require('./memed'), 'setPaciente').mockResolvedValue({ success: true });
      jest.spyOn(require('./memed'), 'setMedications').mockResolvedValue({ success: true });
      jest.spyOn(require('./memed'), 'viewVoicePrescription').mockResolvedValue({ success: true });

      await bootstrapMemed(token, paciente, items);

      expect(require('./memed').loadMemedScript).toHaveBeenCalledWith(token);
      expect(require('./memed').setPaciente).toHaveBeenCalledWith(paciente);
      expect(require('./memed').setMedications).toHaveBeenCalledWith(items);
      expect(require('./memed').viewVoicePrescription).toHaveBeenCalled();
    });
  });

  describe('isMemedAvailable', () => {
    it('should return true when SDK is available', () => {
      expect(isMemedAvailable()).toBe(true);
    });

    it('should return false when MdHub is not available', () => {
      // @ts-ignore
      window.MdHub = undefined;
      expect(isMemedAvailable()).toBe(false);
    });

    it('should return false when MdSinapsePrescricao is not available', () => {
      // @ts-ignore
      window.MdSinapsePrescricao = undefined;
      expect(isMemedAvailable()).toBe(false);
    });
  });

  describe('resetMemedState', () => {
    it('should reset all state variables', () => {
      resetMemedState();
      expect(isMemedAvailable()).toBe(false);
    });
  });

  describe('parseMedicationsFromReport', () => {

    it('deve retornar array vazio quando report é undefined', () => {
      const result = parseMedicationsFromReport(undefined);
      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando report é null', () => {
      const result = parseMedicationsFromReport(null);
      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando report não é um objeto', () => {
      const result = parseMedicationsFromReport('invalid' as any);
      expect(result).toEqual([]);
    });

    it('deve extrair medicamentos de report.consultation.prescription.medications', () => {
      const report = {
        consultation: {
          prescription: {
            medications: [
              { medication: 'Dipirona', dosageInstruction: '500mg a cada 8 horas' },
              { medication: 'Paracetamol', dosage: '1000mg' }
            ]
          }
        }
      };

      const result = parseMedicationsFromReport(report);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual({
        medication: 'Dipirona',
        dosageInstruction: '500mg a cada 8 horas'
      });
      expect(result[1]).toEqual({
        medication: 'Paracetamol',
        dosageInstruction: '1000mg'
      });
    });

    it('deve extrair medicamentos de report.prescription.medications', () => {
      const report = {
        prescription: {
          medications: [
            { medication: 'Ibuprofeno', dosageInstruction: '200mg' }
          ]
        }
      };

      const result = parseMedicationsFromReport(report);
      expect(result.length).toBe(1);
      expect(result[0].medication).toBe('Ibuprofeno');
    });

    it('deve extrair medicamentos de report.medications', () => {
      const report = {
        medications: [
          { medication: 'Amoxicilina', dosageInstruction: '500mg' }
        ]
      };

      const result = parseMedicationsFromReport(report);
      expect(result.length).toBe(1);
      expect(result[0].medication).toBe('Amoxicilina');
    });

    it('deve usar campo "name" como fallback para "medication"', () => {
      const report = {
        medications: [
          { name: 'Aspirina', dosageInstruction: '100mg' }
        ]
      };

      const result = parseMedicationsFromReport(report);
      expect(result[0].medication).toBe('Aspirina');
    });

    it('deve usar campo "medicacao" como fallback para "medication"', () => {
      const report = {
        medications: [
          { medicacao: 'Omeprazol', posologia: '20mg' }
        ]
      };

      const result = parseMedicationsFromReport(report);
      expect(result[0].medication).toBe('Omeprazol');
    });

    it('deve usar campos de dosagem alternativos', () => {
      const report = {
        medications: [
          {
            medication: 'Med1',
            dosagem: 'dose1'
          },
          {
            medication: 'Med2',
            posologia: 'dose2'
          },
          {
            medication: 'Med3',
            dosage: 'dose3'
          }
        ]
      };

      const result = parseMedicationsFromReport(report);
      expect(result[0].dosageInstruction).toBe('dose1');
      expect(result[1].dosageInstruction).toBe('dose2');
      expect(result[2].dosageInstruction).toBe('dose3');
    });

    it('deve filtrar medicamentos sem nome', () => {
      const report = {
        medications: [
          { medication: 'Válido' },
          { medication: '' },
          { dosageInstruction: '500mg' }, // sem medication
          { medication: '   ' } // whitespace apenas
        ]
      };

      const result = parseMedicationsFromReport(report);
      expect(result.length).toBe(1);
      expect(result[0].medication).toBe('Válido');
    });

    it('deve remover whitespace do nome do medicamento', () => {
      const report = {
        medications: [
          { medication: '  Dipirona  ' }
        ]
      };

      const result = parseMedicationsFromReport(report);
      expect(result[0].medication).toBe('Dipirona');
    });

    it('deve filtrar elementos não-objeto no array', () => {
      const report = {
        medications: [
          { medication: 'Válido' },
          null,
          undefined,
          'string'
        ]
      };

      const result = parseMedicationsFromReport(report);
      expect(result.length).toBe(1);
      expect(result[0].medication).toBe('Válido');
    });

    it('deve retornar array vazio se medications não é array', () => {
      const report = {
        medications: 'not-an-array'
      };

      const result = parseMedicationsFromReport(report);
      expect(result).toEqual([]);
    });

    it('deve retornar array vazio em caso de erro não esperado', () => {
      // Cria um objeto com getter que lança erro
      const report = {};
      Object.defineProperty(report, 'consultation', {
        get() {
          throw new Error('Erro intencional');
        }
      });

      const result = parseMedicationsFromReport(report);
      expect(result).toEqual([]);
    });

    it('deve priorizar report.consultation.prescription.medications', () => {
      const report = {
        consultation: {
          prescription: {
            medications: [
              { medication: 'De consultation' }
            ]
          }
        },
        prescription: {
          medications: [
            { medication: 'De prescription' }
          ]
        },
        medications: [
          { medication: 'De root' }
        ]
      };

      const result = parseMedicationsFromReport(report);
      expect(result[0].medication).toBe('De consultation');
    });

    it('deve converter números em strings', () => {
      const report = {
        medications: [
          { medication: 123 as any, dosageInstruction: 456 as any }
        ]
      };

      const result = parseMedicationsFromReport(report);
      expect(result[0].medication).toBe('123');
      expect(result[0].dosageInstruction).toBe('456');
    });

  });
});

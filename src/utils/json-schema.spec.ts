import { getPatientData, validateMemedPaciente } from './json-schema';
import type { MemedPaciente } from '../components/entities/consultation.entity';

describe('getPatientData', () => {
  it('should validate valid patient data', () => {
    const validPatientData = JSON.stringify({
      externalId: '12345',
      name: 'João Silva',
      email: 'joao@example.com',
      document: '12345678901'
    });

    const result = getPatientData(validPatientData);

    expect(result.success).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.success?.externalId).toBe('12345');
    expect(result.success?.name).toBe('João Silva');
    expect(result.success?.email).toBe('joao@example.com');
    expect(result.success?.document).toBe('12345678901');
  });

  it('should validate patient data without document', () => {
    const validPatientData = JSON.stringify({
      externalId: '12345',
      name: 'João Silva',
      email: 'joao@example.com'
    });

    const result = getPatientData(validPatientData);

    expect(result.success).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.success?.externalId).toBe('12345');
    expect(result.success?.name).toBe('João Silva');
    expect(result.success?.email).toBe('joao@example.com');
    expect(result.success?.document).toBeUndefined();
  });

  it('should reject invalid email format', () => {
    const invalidPatientData = JSON.stringify({
      externalId: '12345',
      name: 'João Silva',
      email: 'invalid-email'
    });

    const result = getPatientData(invalidPatientData);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('email');
  });

  it('should reject missing externalId', () => {
    const invalidPatientData = JSON.stringify({
      name: 'João Silva',
      email: 'joao@example.com'
    });

    const result = getPatientData(invalidPatientData);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('externalId');
  });

  it('should reject missing name', () => {
    const invalidPatientData = JSON.stringify({
      externalId: '12345',
      email: 'joao@example.com'
    });

    const result = getPatientData(invalidPatientData);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('name');
  });

  it('should reject missing email', () => {
    const invalidPatientData = JSON.stringify({
      externalId: '12345',
      name: 'João Silva'
    });

    const result = getPatientData(invalidPatientData);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('email');
  });

  it('should reject invalid JSON', () => {
    const invalidJson = 'invalid-json';

    const result = getPatientData(invalidJson);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
  });

  it('should reject non-string externalId', () => {
    const invalidPatientData = JSON.stringify({
      externalId: 12345,
      name: 'João Silva',
      email: 'joao@example.com'
    });

    const result = getPatientData(invalidPatientData);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('externalId');
  });

  it('should reject non-string name', () => {
    const invalidPatientData = JSON.stringify({
      externalId: '12345',
      name: 123,
      email: 'joao@example.com'
    });

    const result = getPatientData(invalidPatientData);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('name');
  });

  it('should reject non-string email', () => {
    const invalidPatientData = JSON.stringify({
      externalId: '12345',
      name: 'João Silva',
      email: 123
    });

    const result = getPatientData(invalidPatientData);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('email');
  });

  it('should reject non-string document when provided', () => {
    const invalidPatientData = JSON.stringify({
      externalId: '12345',
      name: 'João Silva',
      email: 'joao@example.com',
      document: 12345678901
    });

    const result = getPatientData(invalidPatientData);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('document');
  });
});

describe('validateMemedPaciente', () => {
  it('should return success with valid Memed patient data', () => {
    const validMemedPatient: MemedPaciente = {
      idExterno: '12345',
      nome: 'João Silva',
      telefone: '11999999999'
    };

    const result = validateMemedPaciente(validMemedPatient);
    expect(result.success).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.success?.idExterno).toBe('12345');
    expect(result.success?.nome).toBe('João Silva');
    expect(result.success?.telefone).toBe('11999999999');
  });

  it('should return success with valid Memed patient data including optional fields', () => {
    const validMemedPatient: MemedPaciente = {
      idExterno: '12345',
      nome: 'João Silva',
      telefone: '11999999999',
      email: 'joao@example.com',
      documento: '12345678901',
      dataNascimento: '1990-01-01',
      sexo: 'M',
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567'
      }
    };

    const result = validateMemedPaciente(validMemedPatient);
    expect(result.success).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.success?.email).toBe('joao@example.com');
    expect(result.success?.endereco?.cidade).toBe('São Paulo');
  });

  it('should return error if idExterno is missing', () => {
    const invalidMemedPatient: MemedPaciente = {
      nome: 'João Silva',
      telefone: '11999999999'
    } as MemedPaciente;

    const result = validateMemedPaciente(invalidMemedPatient);
    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('Campo "idExterno" é obrigatório');
  });

  it('should return error if nome is missing', () => {
    const invalidMemedPatient: MemedPaciente = {
      idExterno: '12345',
      telefone: '11999999999'
    } as MemedPaciente;

    const result = validateMemedPaciente(invalidMemedPatient);
    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('Campo "nome" é obrigatório');
  });

  it('should return error if telefone is missing', () => {
    const invalidMemedPatient: MemedPaciente = {
      idExterno: '12345',
      nome: 'João Silva'
    } as MemedPaciente;

    const result = validateMemedPaciente(invalidMemedPatient);
    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('Campo "telefone" é obrigatório');
  });

  it('should return error for invalid email format', () => {
    const invalidMemedPatient: MemedPaciente = {
      idExterno: '12345',
      nome: 'João Silva',
      telefone: '11999999999',
      email: 'invalid-email'
    };

    const result = validateMemedPaciente(invalidMemedPatient);
    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('Campo "email" deve ter um formato válido');
  });

  it('should return error if documento is not a string', () => {
    const invalidMemedPatient: MemedPaciente = {
      idExterno: '12345',
      nome: 'João Silva',
      telefone: '11999999999',
      documento: 123 as any
    };

    const result = validateMemedPaciente(invalidMemedPatient);
    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.[0]).toContain('Campo "documento" deve ser uma string quando fornecido');
  });
});


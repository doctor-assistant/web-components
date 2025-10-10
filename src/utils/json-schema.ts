import Ajv, { ErrorObject } from "ajv";
import { ConsultationReportSchema, PatientData, MemedPaciente } from "../components/entities/consultation.entity";

export const getReportSchema = (rawReportSchema: string): { success?: ConsultationReportSchema, error?: string[] } => {
  // Tenta fazer o parse do schema
  try {
    const reportSchemaParsed = parseReportSchema(rawReportSchema);
    const { instructions, fewShots, schema } = reportSchemaParsed;

    // Valida se todos os campos obrigatórios existem
    if (!instructions || typeof instructions !== 'string') {
      throw new Error('Campo "instructions" inválido ou ausente');
    }

    if (!fewShots || typeof fewShots !== 'object') {
      throw new Error('Campo "fewShots" inválido ou ausente');
    }

    if (!schema || typeof schema !== 'object') {
      throw new Error('Campo "schema" inválido ou ausente');
    }

    const errors = validateJsonSchema(schema, fewShots);
    if (errors && errors.length > 0) {
      throw new Error(errors.map(error => error.message).join(', '));
    }
    return { success: reportSchemaParsed };
  } catch (error) {
    return { error: [error.message] };
  }
};

const parseReportSchema = (rawReportSchema: string): ConsultationReportSchema => {
  return JSON.parse(rawReportSchema) as ConsultationReportSchema;
};

const validateJsonSchema = (schema: Record<string, unknown>, rawFewShots: Record<string, unknown> | Record<string, unknown>[]): ErrorObject<string, Record<string, any>, unknown>[] => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  const errors: ErrorObject<string, Record<string, any>, unknown>[] = [];
  const fewShots = Array.isArray(rawFewShots) ? rawFewShots : [rawFewShots];

  fewShots.forEach((shot: Record<string, unknown>) => {
    validate(shot);
    if (validate.errors) errors.push(...validate.errors);
  });

  return errors;
};

export const getPatientData = (rawPatientData: string): { success?: PatientData, error?: string[] } => {
  try {
    const patientDataParsed = JSON.parse(rawPatientData) as PatientData;

    // Valida se todos os campos obrigatórios existem
    if (!patientDataParsed.externalId || typeof patientDataParsed.externalId !== 'string') {
      throw new Error('Campo "externalId" é obrigatório e deve ser uma string');
    }

    if (!patientDataParsed.name || typeof patientDataParsed.name !== 'string') {
      throw new Error('Campo "name" é obrigatório e deve ser uma string');
    }

    if (!patientDataParsed.email || typeof patientDataParsed.email !== 'string') {
      throw new Error('Campo "email" é obrigatório e deve ser uma string');
    }

    // Valida formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientDataParsed.email)) {
      throw new Error('Campo "email" deve ter um formato válido');
    }

    // Valida document se fornecido
    if (patientDataParsed.document && typeof patientDataParsed.document !== 'string') {
      throw new Error('Campo "document" deve ser uma string quando fornecido');
    }

    return { success: patientDataParsed };
  } catch (error) {
    return { error: [error.message] };
  }
};

export const validateMemedPaciente = (memedPatient: MemedPaciente): { success?: MemedPaciente, error?: string[] } => {
  try {
    if (!memedPatient.idExterno || typeof memedPatient.idExterno !== 'string') {
      throw new Error('Campo "idExterno" é obrigatório e deve ser uma string');
    }
    if (!memedPatient.nome || typeof memedPatient.nome !== 'string') {
      throw new Error('Campo "nome" é obrigatório e deve ser uma string');
    }
    if (!memedPatient.telefone || typeof memedPatient.telefone !== 'string') {
      throw new Error('Campo "telefone" é obrigatório e deve ser uma string');
    }

    // Validação opcional do email se fornecido
    if (memedPatient.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(memedPatient.email)) {
        throw new Error('Campo "email" deve ter um formato válido');
      }
    }

    // Validação opcional do documento se fornecido
    if (memedPatient.documento && typeof memedPatient.documento !== 'string') {
      throw new Error('Campo "documento" deve ser uma string quando fornecido');
    }

    return { success: memedPatient };
  } catch (error) {
    return { error: [error.message] };
  }
};

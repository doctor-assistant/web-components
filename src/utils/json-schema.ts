import Ajv, { ErrorObject } from "ajv";
import { ConsultationReportSchema } from "../components/entities/consultation.entity";

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
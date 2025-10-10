export interface ConsultationResponse {
  id: string
  notes?: string
  reason?: string
  transcription?: string
  recording: { id: string | undefined; duration: number }
  report: Record<string, unknown>
  metadata: Record<string, unknown>
}

export type ConsultationReportSchema = {
  instructions: string;
  fewShots: string;
  schema: Record<string, unknown>;
};

export interface PatientData {
  externalId: string;
  name: string;
  document?: string;
  email: string;
}

export interface MemedPaciente {
  idExterno: string;
  nome: string;
  telefone: string;
  email?: string;
  documento?: string;
  dataNascimento?: string;
  sexo?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
}

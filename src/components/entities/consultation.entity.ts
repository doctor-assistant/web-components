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

export type ConsultationPrescriptionProvider = 'MEVO' | 'MEMED';

export type ConsultationPrescriptionDataMEVO = {
  externalReference: string;
};

export type ConsultationPrescriptionDataMEMED = {
  patient: {
    externalId: string;
    name: string;
    email: string;
    phone: string;
    document?: string;
  }
  token: string;
};

export type ConsultationPrescriptionData = {
  provider: ConsultationPrescriptionProvider;
} & (ConsultationPrescriptionDataMEVO | ConsultationPrescriptionDataMEMED);

import { ConsultationPrescriptionData, ConsultationPrescriptionDataMEMED, ConsultationPrescriptionDataMEVO } from "../components/entities/consultation.entity";

export const validatePrescriptionData = (prescriptionData: ConsultationPrescriptionData): boolean => {
  // Validate provider
  const allowedProviders = ['MEMED', 'MEVO'];
  if (!allowedProviders.includes(prescriptionData.provider)) {
    throw new Error(`Invalid provider: ${prescriptionData.provider}`);
  }
  // Validate prescription data
  switch (prescriptionData.provider) {
    case 'MEVO':
      mevoPrescriptionValidator(prescriptionData as ConsultationPrescriptionDataMEVO);
      break;
    case 'MEMED':
      memedPrescriptionValidator(prescriptionData as ConsultationPrescriptionDataMEMED);
      break;
  }
  return true;
};

const memedPrescriptionValidator = (prescriptionData: ConsultationPrescriptionDataMEMED) => {
  if (!prescriptionData.patient.externalId) {
    throw new Error('Invalid patient external id');
  }
  if (!prescriptionData.patient.name) {
    throw new Error('Invalid patient name');
  }
  if (!prescriptionData.patient.email) {
    throw new Error('Invalid patient email');
  }
  if (!prescriptionData.patient.document) {
    throw new Error('Invalid patient document');
  }
}

const mevoPrescriptionValidator = (prescriptionData: ConsultationPrescriptionDataMEVO) => {
  if (!prescriptionData.externalReference) {
    throw new Error('Invalid external reference');
  }
}
/**
 * @fileoverview entry point for your component library
 *
 * This is the entry point for your component library. Use this file to export utilities,
 * constants or data structure that accompany your components.
 *
 * DO NOT use this file to export your components. Instead, use the recommended approaches
 * to consume components of this package as outlined in the `README.md`.
 */

export { format } from './utils/utils';
export {
  loadMemedScript,
  waitForModuleInitialization,
  initializeMemed,
  setPaciente,
  setMedications,
  showPrescription,
  hidePrescription,
  viewVoicePrescription,
  bootstrapPrescription,
  bootstrapMemed,
  isMemedAvailable,
  resetMemedState,
  type MemedPaciente,
  type MemedMedicationItem,
  type MemedCommandResponse,
  type MemedModuleType
} from './utils/memed';
export type * from './components.d.ts';

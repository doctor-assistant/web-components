export interface ConsultationResponse {
  id: string
  notes?: string
  reason?: string
  transcription?: string
  recording: { id: string | undefined; duration: number}
  report: Record<string, unknown>
  metadata: Record<string, unknown>
}

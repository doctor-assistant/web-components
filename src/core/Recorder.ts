import { version } from '../../package.json';

import state from "../store";
import { deleteChunk, deleteConsultationById, getConsultation, getConsultationsByProfessional, getFailedChunks, saveChunk, saveConsultation } from '../utils/indexDb';
import { EventSourceManager } from "../utils/sse";

const CHUNK_CONFIG = {
  MIN_DURATION: 270, // seconds
  MAX_DURATION: 300, // seconds
  SILENCE_THRESHOLD: -50, // dB
  SILENCE_DURATION: 0.5, // seconds of silence needed for chunk split
  RETRY_INTERVAL: 300, // ms
  MAX_RETRIES: 5
};

const API_ENDPOINTS = {
  CONSULTATION_INIT: '/consultations/v2',
  CONSULTATION_CHUNK: (consultationId: string, recordingId: string) =>
    `/consultations/v2/${consultationId}/recordings/${recordingId}/chunks`,
  CONSULTATION_FINISH: (consultationId: string, recordingId: string) =>
    `/consultations/v2/${consultationId}/recordings/${recordingId}/finish`
};

interface ConsultationResponse {
  id: string;
  recording: {
    id: string;
  };
}

interface ChunkData {
  id: string;
  consultationId: string;
  recordingId: string;
  chunk: Blob;
  duration: number;
  index: number;
  retryCount: number;
  timestamp: number;
}

let mediaRecorder: MediaRecorder | null = null;
let silenceDetectorNode: ScriptProcessorNode | null = null;
let analyserNode: AnalyserNode | null = null;

let localStream: MediaStream | null = null;

// Move consultation state from store to class variables
let chunkStartTime: number = 0;
let audioContextStartTime: number = 0;
let currentConsultation: ConsultationResponse | null = null;
let currentChunkIndex: number = -1;

let screenStream: MediaStream | null = null;

let videoElementStream: MediaStream | null = null;

let videoElementSource: MediaElementAudioSourceNode | null = null;

let audioContext: AudioContext | null = null

// Track chunks being uploaded for the first time
const pendingFirstUploads = new Set<number>();

let retryIdFromIndexDb: any

let retryProfessionalFromIndexDb: any



export const StartTutorial = () => {
  state.openTutorialPopup = true;
}


export const startRecording = async (
  isRemote: boolean,
  videoElement?: HTMLVideoElement,
  mode?: string,
  apikey?: string,
  professional?: string,
  metadata?: string
) => {
  if (!mode || !apikey) {
    console.error('Missing required parameters for recording');
    state.status = "initial";
    return;
  }

  try {
    const baseUrl = mode === "dev"
    ? "https://apim.doctorassistant.ai/api/sandbox"
    : "https://apim.doctorassistant.ai/api/production";
    console.log('baseUrl',baseUrl)
    console.log('baseUrl + API_ENDPOINTS.CONSULTATION_INIT',baseUrl + API_ENDPOINTS.CONSULTATION_INIT)
    const response = await fetch(baseUrl + API_ENDPOINTS.CONSULTATION_INIT, {
      method: 'POST',
      headers: {
        'x-daai-api-key': apikey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        professionalId: professional,
        metadata: typeof metadata === 'string' ? JSON.parse(metadata) : metadata
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to initialize consultation:', error);
      state.status = "initial";
      return;
    }

    const consultation: ConsultationResponse = await response.json();
    currentConsultation = consultation;
    currentChunkIndex = -1; // Will be incremented to 0 before first chunk
    state.chooseModality = true;

    // Start the retry process for this recording session
    startRetryProcess(mode, apikey);

    const constraints = {
      audio: {
        deviceId: state.chosenMicrophone
          ? { exact: state.defaultMicrophone }
          : undefined,
      },
    };
    if (!audioContext) {
      audioContext = new AudioContext();
      audioContextStartTime = audioContext.currentTime;
      chunkStartTime = audioContextStartTime;
    }
    if (isRemote) {
      state.telemedicine = true;
      if (videoElement) {
        try {
          if (!videoElementSource) {
            videoElementSource = audioContext.createMediaElementSource(videoElement);
          }
          const destination = audioContext.createMediaStreamDestination();
          videoElementSource.connect(destination);
          videoElementStream = destination.stream;
        } catch (error) {
          console.error('Erro ao capturar áudio do vídeo:', error);
          try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({
              audio: true,
            });
          } catch (error) {
            return (state.status = "initial");
          }
        }
      } else {
        try {
          screenStream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
          });
        } catch (error) {
          return (state.status = "initial");
        }
      }
    }

    state.openTutorialPopup = false;
    state.status = "recording";

    const micStream = await navigator.mediaDevices.getUserMedia(constraints);

    localStream = micStream;
    const composedStream = new MediaStream();
    const audioDestination = audioContext.createMediaStreamDestination();

    if (isRemote) {
      if (videoElementStream?.getAudioTracks().length > 0) {
        const videoSource = audioContext.createMediaStreamSource(videoElementStream);
        const videoGain = audioContext.createGain();
        videoGain.gain.value = 1.0;
        videoSource.connect(videoGain).connect(audioDestination);
      } else if (screenStream?.getAudioTracks().length > 0) {
        const systemSource = audioContext.createMediaStreamSource(screenStream);
        const systemGain = audioContext.createGain();
        systemGain.gain.value = 1.0;
        systemSource.connect(systemGain).connect(audioDestination);
      }
    }

    if (micStream?.getAudioTracks().length > 0) {
      const micSource = audioContext.createMediaStreamSource(micStream);
      const micGain = audioContext.createGain();
      micGain.gain.value = 1.0;
      micSource.connect(micGain).connect(audioDestination);
    }

    audioDestination.stream
      .getAudioTracks()
      .forEach((track) => composedStream.addTrack(track));

    // Setup silence detection without feedback
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    let silenceStart = 0;
    // Use module-level chunkStartTime initialized with AudioContext time
    chunkStartTime = audioContext.currentTime;

    // Create a separate audio path for silence detection
    const silenceSource = audioContext.createMediaStreamSource(composedStream);
    silenceSource.connect(analyserNode);

    silenceDetectorNode = audioContext.createScriptProcessor(2048, 1, 1);
    analyserNode.connect(silenceDetectorNode);
    silenceDetectorNode.connect(audioContext.destination); // Required for processing to work
    silenceDetectorNode.onaudioprocess = () => {
      if(analyserNode){
        analyserNode.getFloatTimeDomainData(dataArray);
      }

      const rms = Math.sqrt(dataArray.reduce((acc, val) => acc + val * val, 0) / dataArray.length);
      const db = 20 * Math.log10(rms);

      const currentTime = audioContext.currentTime;
      const chunkDuration = currentTime - chunkStartTime;

      if (db <= CHUNK_CONFIG.SILENCE_THRESHOLD) {
        if (!silenceStart) silenceStart = currentTime;
        const silenceDuration = currentTime - silenceStart;

        if (silenceDuration >= CHUNK_CONFIG.SILENCE_DURATION &&
          chunkDuration >= CHUNK_CONFIG.MIN_DURATION) {
          // Stop current recording and start new one
          const oldMediaRecorder = mediaRecorder;
          const newChunkStartTime = audioContext.currentTime;
          mediaRecorder = new MediaRecorder(composedStream);
          setupMediaRecorder(mode, apikey);
          oldMediaRecorder.stop();
          mediaRecorder.start();

          chunkStartTime = newChunkStartTime;
          silenceStart = 0;
          currentChunkIndex++;
        }
      } else {
        silenceStart = 0;
      }

      // Force split if max duration reached
      if (chunkDuration >= CHUNK_CONFIG.MAX_DURATION) {
        const oldMediaRecorder = mediaRecorder;
        const newChunkStartTime = audioContext.currentTime;
        mediaRecorder = new MediaRecorder(composedStream);
        setupMediaRecorder(mode, apikey);
        oldMediaRecorder.stop();
        mediaRecorder.start();

        chunkStartTime = newChunkStartTime;
        currentChunkIndex++;
      }
    };

    const setupMediaRecorder = (mode: string, apikey: string) => {
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && currentConsultation) {
          // Calculate duration using AudioContext timing (in seconds)
          const currentTime = audioContext.currentTime;
          const duration = Math.max(1, Math.ceil(currentTime - chunkStartTime));
          const chunk: ChunkData = {
            id:`${currentChunkIndex}-${currentConsultation.recording.id}`,
            consultationId: currentConsultation.id,
            recordingId: currentConsultation.recording.id,
            chunk: event.data,
            duration,
            index: currentChunkIndex,
            retryCount: 0,
            timestamp: Date.now()
          };
          pendingFirstUploads.add(currentChunkIndex);
          const uploaded = await uploadChunk(chunk, mode, apikey);
          if (!uploaded) {
            await saveChunk(chunk);
          }
          pendingFirstUploads.delete(currentChunkIndex);
        }
      };
    };

    mediaRecorder = new MediaRecorder(composedStream);
    setupMediaRecorder(mode, apikey);
    mediaRecorder.start();
  } catch (error) {
    console.error('Error starting recording:', error);
    state.status = "initial";
    pendingFirstUploads.clear(); // Clear pending uploads on error
    if (mediaRecorder) {
      try {
        mediaRecorder.stop();
      } catch (e) {
        // Ignore stop errors
      }
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream = null;
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      screenStream = null;
    }
    if (silenceDetectorNode) {
      silenceDetectorNode.disconnect();
      silenceDetectorNode = null;
    }
    if (analyserNode) {
      analyserNode.disconnect();
      analyserNode = null;
    }
    if (retryInterval) {
      clearInterval(retryInterval);
      retryInterval = null;
    }
  }
};

export const pauseRecording = () => {
  if (mediaRecorder?.state === "recording") {
    mediaRecorder.pause();
    state.status = "paused";
  }
  if (localStream) {
    localStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = false));
    state.status = "paused";
  }
}

export const resumeRecording = () => {
  if (mediaRecorder?.state === "paused") {
    mediaRecorder.resume();
    state.status = "resume";
  }
}


type FinishRecordingProps = {
  mode: string,
  apikey: string,
  success: (event: Record<string, any>) => void,
  error: (error: any) => void,
  specialty: string,
  metadata: string,
  onEvent: (event: any) => void,
  professional: string,
}

export const finishRecording = async ({
  mode,
  apikey,
  success,
  error,
  specialty,
}: FinishRecordingProps) => {
  state.status = "finished";

  // Stop recording first
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    currentChunkIndex++; // Increment index before final chunk
    chunkStartTime = audioContext.currentTime; // Update for the final chunk
    mediaRecorder.stop();
  }

  // Clean up streams
  if (mediaRecorder?.stream) {
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  if (screenStream) {
    screenStream.getTracks().forEach(track => track.stop());
    screenStream = null;
  }
  mediaRecorder = null;

  // Wait for all chunks to upload
  const waitForChunks = async () => {
    let failedChunks = await getFailedChunks();
    while (failedChunks.length !== 0 || pendingFirstUploads.size !== 0) {
      await new Promise(resolve => setTimeout(resolve, CHUNK_CONFIG.RETRY_INTERVAL));
      failedChunks = await getFailedChunks();
    }
  };

  try {
    await waitForChunks();
    pendingFirstUploads.clear(); // Clean up after all chunks are uploaded

    // Finalize consultation
    const baseUrl = mode === "dev"
      ? "https://apim.doctorassistant.ai/api/sandbox"
      : "https://apim.doctorassistant.ai/api/production";
    specialty = specialty || 'generic'
    console.log(specialty,'specialty')
    const response = await fetch(baseUrl + API_ENDPOINTS.CONSULTATION_FINISH(
      currentConsultation.id,
      currentConsultation.recording.id
    ), {
      method: 'POST',
      headers: {
        'x-daai-api-key': apikey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ specialty })
    });

    if (!response.ok) {
      throw new Error('Failed to finalize consultation');
    }

    const jsonResponse = await response.json();
    state.status = "upload-ok";
    if (typeof success === "function") {
      success(jsonResponse);
    }
  } catch (err) {
    pendingFirstUploads.clear(); // Clean up on error
    state.status = "upload-error";
    if (typeof error === "function") {
      error(err);
    }
  }
};
type UploadAudioProps = {
  mode: string,
  audioBlob: Blob,
  apiKey: string,
  success: (event: Record<string, any>) => void,
  error: (error: any) => void,
  specialty: string,
  metadata: string,
  event: (event: any) => void,
  professional: string,
  isRetry?: boolean,
}

export const uploadChunk = async (chunk: ChunkData, mode: string, apiKey: string) => {
  const baseUrl = mode === "dev"
    ? "https://apim.doctorassistant.ai/api/sandbox"
    : "https://apim.doctorassistant.ai/api/production";

  const formData = new FormData();
  formData.append('recording', chunk.chunk);
  formData.append('duration', chunk.duration.toString());
  formData.append('chunkIndex', chunk.index.toString());

  try {
    const response = await fetch(baseUrl + API_ENDPOINTS.CONSULTATION_CHUNK(chunk.consultationId, chunk.recordingId), {
      method: 'POST',
      headers: {
        'x-daai-api-key': apiKey
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload chunk');
    }

    await deleteChunk(chunk.id);
    return true; // Upload successful
  } catch (error) {
    console.error('Error uploading chunk:', error);
    return false; // Upload failed, will be retried
  }
};

// Start background retry process
let retryInterval: ReturnType<typeof setInterval> | null = null;

export const startRetryProcess = (mode: string, apiKey: string) => {
  // Clear any existing retry process
  if (retryInterval) {
    clearInterval(retryInterval);
  }
  if (!mode || !apiKey) {
    console.error('Missing required parameters for retry process');
    return;
  }
  retryInterval = setInterval(async () => {
    if (state.isProcessingChunk) return;

    state.isProcessingChunk = true;
    try {
      const failedChunks = await getFailedChunks();
      for (const chunk of failedChunks) {
        if (chunk.retryCount >= CHUNK_CONFIG.MAX_RETRIES) {
          await deleteChunk(chunk.id);
          continue;
        }

        try {
          await uploadChunk(chunk, mode, apiKey);
        } catch (error) {
          chunk.retryCount++;
          await saveChunk(chunk);
        }
      }
    } finally {
      state.isProcessingChunk = false;
    }
  }, CHUNK_CONFIG.RETRY_INTERVAL);
};

export const uploadAudio = async ({ mode, audioBlob, apiKey, success, error, specialty, metadata, event, professional, isRetry }: UploadAudioProps) => {
  const url =
    mode === "dev"
      ? "https://apim.doctorassistant.ai/api/sandbox/consultations"
      : "https://apim.doctorassistant.ai/api/production/consultations";

  const formData = new FormData();
  formData.append("recording", audioBlob);
  console.log(specialty,'spec')
  if (specialty) {
    formData.append("specialty", specialty);
  }

  let metadataObj: any = {};

  if (!isRetry) {
    try {
      metadataObj = typeof metadata === "string" ? JSON.parse(metadata) : metadata || {};
      metadataObj.daai = { version, origin: "consultation-recorder-component" };
    } catch (err) {
      console.error("Erro ao fazer parse do metadata:", err, metadata);
      metadataObj = {};
    }
    formData.append("metadata", JSON.stringify(metadataObj));
  } else {
    formData.append("metadata", typeof metadata === "string" ? metadata : JSON.stringify(metadata));
  }

  formData.append("professionalId", professional);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-daai-api-key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      if (typeof error === "function") {
        error(errorResponse);
      }
    }

    if (response.ok) {
      const jsonResponse = await response.json();
      const consultationId = jsonResponse.id;
      if (isRetry) {
        deleteConsultationById(retryProfessionalFromIndexDb, retryIdFromIndexDb);
      }
      state.status = "upload-ok";
      if (typeof success === "function") {
        success(jsonResponse);
      }
      if (typeof event === "function") {
        const sseUrl = `${url}/${consultationId}/events`;
        let eventSourceManager = new EventSourceManager(apiKey, sseUrl, event);
        eventSourceManager.connect();
      }
    }
  } catch (err) {
    state.status = "upload-error";
    console.error("Erro ao enviar o áudio:", err);
    if (!isRetry) {
      metadataObj.daai = metadataObj.daai || {}; // Garante que daai existe
      metadataObj.daai.fallback = { occurredAt: new Date() };
      saveConsultation(professional, audioBlob, specialty, metadataObj);
    }
    if (typeof error === "function") {
      error(err);
    }
  }
};


export const retryUpload = async (mode: string, apikey: string, professional: string, success: any, error: any, event: any, isRetry: boolean) => {
  const consultations = await getConsultationsByProfessional(professional);
  if (!consultations.length) {
    console.warn("Nenhuma consulta encontrada para o profissional:", professional);
    return;
  }

  const latestConsultation = consultations.reduce((latest, current) =>
    !latest.id || current.id > latest.id ? current : latest
  );

  retryIdFromIndexDb = latestConsultation.id
  retryProfessionalFromIndexDb = latestConsultation.professionalId

  try {
    await uploadAudio(
      {
        mode: mode,
        audioBlob: latestConsultation.audioBlob,
        apiKey: apikey,
        success: success,
        error: error,
        specialty: latestConsultation.specialty,
        metadata: latestConsultation.metadata,
        event: event,
        professional: professional,
        isRetry: isRetry,
      }
    );
  } catch {
    state.status = 'upload-error'
  }
};


export const retryOldConsultations = async (mode: string, apiKey: string) => {
  const url =
    mode === "dev"
      ? "https://apim.doctorassistant.ai/api/sandbox/consultations"
      : "https://apim.doctorassistant.ai/api/production/consultations";

  const consultations = await getConsultation();

  if (!consultations.length) {
    return;
  }

  for (const consultation of consultations) {
    try {
      const formData = new FormData();
      formData.append("recording", consultation.audioBlob);

      formData.append("professionalId", consultation.professionalId);
      if (consultation.specialty) {
        formData.append("specialty", consultation.specialty);
      }

      formData.append("metadata", JSON.stringify(consultation.metadata));

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "x-daai-api-key": apiKey,
        },
        body: formData,
      });

      if (response.ok) {

        await deleteConsultationById(consultation.professionalId, consultation.id);
      } else {
        console.error(`Erro ao enviar consulta ${consultation.id}:`, await response.text());
      }
    } catch (error) {
      console.error(`Erro ao processar consulta ${consultation.id}:`, error);
    }
  }
};

export const openConfigModal = () => {
  state.openModalConfig = true;
};

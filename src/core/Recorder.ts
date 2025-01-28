import state from "../store";
import { EventSourceManager } from "../utils/sse";

const isNetworkError = (error: any): boolean => {
  return !window.navigator.onLine || 
         error instanceof TypeError || 
         error.message?.toLowerCase().includes('failed to fetch') ||
         error.message?.toLowerCase().includes('network');
};

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

interface FailedUpload {
  audioBlob: Blob;
  apiKey: string;
  specialty?: string;
  metadata?: string;
  professional?: string;
  timestamp: number;
  attempts: number;
}

interface FailedUpload {
  audioBlob: Blob;
  apiKey: string;
  specialty?: string;
  metadata?: string;
  professional?: string;
  timestamp: number;
  attempts: number;
}

const failedUploads: FailedUpload[] = [];

const storeFailedUpload = async (upload: FailedUpload): Promise<void> => {
  failedUploads.push(upload);
};

const getNextFailedUpload = async (): Promise<FailedUpload | null> => {
  if (failedUploads.length === 0) {
    return null;
  }
  return failedUploads.shift() || null;
};

const processFailedUploads = async (): Promise<void> => {
  let failedUpload = await getNextFailedUpload();
  
  while (failedUpload !== null) {
    try {
      await uploadAudioWithRetry(
        failedUpload.audioBlob,
        failedUpload.apiKey,
        undefined,
        undefined,
        failedUpload.specialty,
        failedUpload.metadata,
        undefined,
        failedUpload.professional,
        3,
        2000
      );
      console.log('Áudio pendente enviado com sucesso.');
    } catch (err) {
      console.error('Não foi possível reenviar o áudio pendente:', err);
      if (isNetworkError(err)) {
        await storeFailedUpload({
          ...failedUpload,
          timestamp: Date.now(),
          attempts: (failedUpload.attempts || 0) + 1
        });
      }
    }
    failedUpload = await getNextFailedUpload();
  }
};

const uploadAudioWithRetry = async (
  audioBlob: Blob,
  apiKey: string,
  success?: (response: any) => void,
  error?: (error: any) => void,
  specialty?: string,
  metadata?: string,
  event?: (event: any) => void,
  professional?: string,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<void> => {
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    try {
      const mode = apiKey?.startsWith("PRODUCTION") ? "prod" : "dev";
      const url = mode === "dev"
        ? "https://apim.doctorassistant.ai/api/sandbox/consultations"
        : "https://apim.doctorassistant.ai/api/production/consultations";

      const formData = new FormData();
      formData.append("recording", audioBlob);
      if (specialty) {
        formData.append("specialty", specialty);
      }
      if (metadata) {
        formData.append("metadata", metadata);
      }
      formData.append("professionalId", professional);

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
        throw new Error(JSON.stringify(errorResponse));
      }

      const jsonResponse = await response.json();
      const consultationId = jsonResponse.id;

      state.status = "upload-ok";
      if (typeof success === "function") {
        success(response);
      }
      if (typeof event === "function") {
        const sseUrl = `${url}/${consultationId}/events`;
        let eventSourceManager = new EventSourceManager(apiKey, sseUrl, event);
        eventSourceManager.connect();
      }
      
      return;
    } catch (err) {
      attempt++;
      
      if (attempt >= maxAttempts || !isNetworkError(err)) {
        const isNetwork = isNetworkError(err);
        const errorMessage = isNetwork
          ? `Não foi possível enviar o áudio após ${maxAttempts} tentativas. Verifique sua conexão com a internet.`
          : 'Ocorreu um erro ao enviar o áudio. Por favor, tente novamente.';
        
        console.error(`${errorMessage} Detalhes:`, err);
        
        if (isNetwork) {
          await storeFailedUpload({
            audioBlob,
            apiKey,
            specialty,
            metadata,
            professional,
            timestamp: Date.now(),
            attempts: attempt
          });
          console.log('Áudio armazenado para reenvio quando a conexão for restaurada.');
        }
        
        if (typeof error === "function") {
          error({
            message: errorMessage,
            originalError: err,
            isNetworkError: isNetwork,
            attempts: attempt
          });
        }
        throw new Error(errorMessage);
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Tentativa ${attempt} de ${maxAttempts} falhou. Tentando novamente em ${delay/1000} segundos...`);
      await sleep(delay);
    }
  }
};

// Main MediaRecorder instance for handling the recording process
let mediaRecorder: MediaRecorder | null = null;
// Primary MediaStream for recording - this is the single source of truth for active recording
let localStream: MediaStream | null = null;
// Stream for screen sharing in remote/telemedicine mode
let screenStream: MediaStream | null = null;


export const StartTutorial = () => {
  state.openTutorialPopup = true;
}


export const startRecording = async (isRemote: boolean) => {
  state.chooseModality = true;

  const constraints = {
    audio: {
      deviceId: state.chosenMicrophone
        ? { exact: state.defaultMicrophone }
        : undefined,
    },
  };
  if (isRemote) {
    state.telemedicine = true
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      });
    } catch (error) {
      return (state.status = "initial");
    }
  }

  state.openTutorialPopup = false;
  state.status = "recording";

  // Get the main recording stream - this will be our single source of truth for the active recording
  const micStream = await navigator.mediaDevices.getUserMedia(constraints);
  // Store the stream for proper cleanup when recording finishes
  localStream = micStream;
  const composedStream = new MediaStream();
  const context = new AudioContext();
  const audioDestination = context.createMediaStreamDestination();

  if (isRemote && screenStream?.getAudioTracks().length > 0) {
    const systemSource = context.createMediaStreamSource(screenStream);
    const systemGain = context.createGain();
    systemGain.gain.value = 1.0;
    systemSource.connect(systemGain).connect(audioDestination);
  }

  if (micStream?.getAudioTracks().length > 0) {
    const micSource = context.createMediaStreamSource(micStream);
    const micGain = context.createGain();
    micGain.gain.value = 1.0;
    micSource.connect(micGain).connect(audioDestination);
  }

  audioDestination.stream
    .getAudioTracks()
    .forEach((track) => composedStream.addTrack(track));

  mediaRecorder = new MediaRecorder(composedStream);

  mediaRecorder.onstart = () => {};
  mediaRecorder.start();
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


export const finishRecording = async (
  apikey,
  success,
  error,
  specialty,
  metadata, onEvent, professional) => {
  const handleRecordingStop = async (audioChunks: Blob[]) => {
    try {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        await uploadAudio(
          audioBlob,
          apikey,
          success,
          error,
          specialty,
          metadata,
          onEvent,
          professional,
        );
    } catch (error) {
      console.error("Não foi possível enviar o áudio", error);
    }
  };
  const audioChunks: Blob[] = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };
  mediaRecorder.onstop = () => {
    // Stop all tracks to remove browser recording indicator
    if (mediaRecorder.stream) {
      mediaRecorder.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    // Clean up localStream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      localStream = null;
    }
    // Clean up screen sharing if active
    if (screenStream) {
      screenStream.getTracks().forEach(track => {
        track.stop();
      });
      screenStream = null;
    }
    // Set mediaRecorder to null to prevent reuse
    mediaRecorder = null;
    handleRecordingStop(audioChunks);
  };
  // Ensure we're in a valid state to stop recording
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    state.status = "finished";
  } else {
    console.warn('MediaRecorder not in recording state, cannot stop');
    state.status = "finished";
  }
};
export const uploadAudio = async (
  audioBlob: Blob,
  apiKey: string,
  success?: (response: any) => void,
  error?: (error: any) => void,
  specialty?: string,
  metadata?: string,
  event?: (event: any) => void,
  professional?: string
): Promise<void> => {
  try {
    await uploadAudioWithRetry(
      audioBlob,
      apiKey,
      success,
      error,
      specialty,
      metadata,
      event,
      professional
    );
    await processFailedUploads();
  } catch (err) {
    console.error("Erro ao enviar o áudio:", err);
    if (typeof error === "function") {
      error(err);
    }
  }
};

export const openConfigModal = () => {
  state.openModalConfig = true;
};

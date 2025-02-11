import { version } from '../../package.json';

import state from "../store";
import { deleteConsultationById, getConsultation, getConsultationsByProfessional, saveConsultation } from '../utils/indexDb';
import { EventSourceManager } from "../utils/sse";


// Main MediaRecorder instance for handling the recording process
let mediaRecorder: MediaRecorder | null = null;
// Primary MediaStream for recording - this is the single source of truth for active recording
let localStream: MediaStream | null = null;
// Stream for screen sharing in remote/telemedicine mode
let screenStream: MediaStream | null = null;

let retryIdFromIndexDb: any

let retryProfessionalFromIndexDb:any



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
        audio: {
          // Explicitly request system audio
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
        },
        video: true, // Required for screen sharing
      });
    } catch (error) {
      console.error('Failed to capture system audio:', error);
      // If system audio fails, try again with video-only sharing
      try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({
          audio: false,
          video: true,
        });
      } catch (fallbackError) {
        console.error('Screen sharing failed completely:', fallbackError);
        return (state.status = "initial");
      }
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
    // Adjust system audio gain to be slightly lower than mic
    systemGain.gain.value = 0.7;
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

  mediaRecorder.onstart = () => { };
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


type FinishRecordingProps = {
 mode: string,
 apikey: string,
 success: (event: Record<string,any>) => void,
 error: (error: any) => void,
 specialty: string,
 metadata: string,
 onEvent:(event:any) => void,
 professional:string,
}

export const finishRecording = async (
  {mode,
  apikey,
  success,
  error,
  specialty,
  metadata, onEvent, professional}: FinishRecordingProps ) => {
  const handleRecordingStop = async (audioChunks: Blob[]) => {
    try {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      await uploadAudio(
      {
        mode:mode,
        audioBlob:audioBlob,
        apiKey:apikey,
        success:success,
        error:error,
        specialty:specialty,
        metadata:metadata,
        event:onEvent,
        professional:professional,
      }
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
type UploadAudioProps = {
  mode: string,
  audioBlob:Blob,
  apiKey: string,
  success: (event: Record<string,any>) => void,
  error: (error: any) => void,
  specialty: string,
  metadata: string,
  event:(event:any) => void,
  professional:string,
  isRetry?:boolean,
 }

 export const uploadAudio = async ({ mode, audioBlob, apiKey, success, error, specialty, metadata, event, professional, isRetry }: UploadAudioProps) => {
  const url =
    mode === "dev"
      ? "https://apim.doctorassistant.ai/api/sandbox/consultations"
      : "https://apim.doctorassistant.ai/api/production/consultations";

  const formData = new FormData();
  formData.append("recording", audioBlob);
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


export const retryUpload = async (mode:string, apikey:string, professional:string ,success:any, error:any, event:any, isRetry:boolean) => {
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

try{
 await uploadAudio(
  {
  mode: mode,
  audioBlob:latestConsultation.audioBlob,
  apiKey:apikey,
  success:success,
  error:error,
  specialty:latestConsultation.specialty,
  metadata:latestConsultation.metadata,
  event:event,
  professional:professional,
  isRetry:isRetry,
  }
);
} catch {
  state.status = 'upload-error'
 }
 };


 export const retryOldConsultations = async (mode:string, apiKey: string) => {
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

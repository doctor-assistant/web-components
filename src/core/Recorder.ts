import { version } from '../../package.json';

import state from "../store";
import { deleteConsultationById, getConsultation, getConsultationsByProfessional, saveConsultation } from '../utils/indexDb';
import { EventSourceManager } from "../utils/sse";


let mediaRecorder: MediaRecorder | null = null;

let localStream: MediaStream | null = null;

let screenStream: MediaStream | null = null;

let videoElementStream: MediaStream | null = null;

let videoElementSource:MediaElementAudioSourceNode | null = null;

let audioContext: AudioContext | null = null

let retryIdFromIndexDb: any

let retryProfessionalFromIndexDb:any



export const StartTutorial = () => {
  state.openTutorialPopup = true;
}


export const startRecording = async (isRemote: boolean, videoElement?: HTMLVideoElement) => {
  state.chooseModality = true;

  const constraints = {
    audio: {
      deviceId: state.chosenMicrophone
        ? { exact: state.defaultMicrophone }
        : undefined,
    },
  };
  if(!audioContext){
    audioContext = new AudioContext()
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
      videoGain.connect(audioContext.destination)
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
    if (mediaRecorder.stream) {
      mediaRecorder.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      localStream = null;
    }

    if (screenStream) {
      screenStream.getTracks().forEach(track => {
        track.stop();
      });
      screenStream = null;
    }

    mediaRecorder = null;
    handleRecordingStop(audioChunks);
  };

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

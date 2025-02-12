import { version } from '../../package.json';

import state from "../store";
import { EventSourceManager } from "../utils/sse";


let mediaRecorder: MediaRecorder | null = null;

let localStream: MediaStream | null = null;

let screenStream: MediaStream | null = null;

let videoElementStream: MediaStream | null = null;

let videoElementSource:MediaElementAudioSourceNode | null = null;

let audioContext: AudioContext | null = null

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
export const uploadAudio = async (audioBlob, apiKey, success, error, specialty, metadata, event, professional) => {

  const mode = apiKey && apiKey.startsWith("PRODUCTION") ? "prod" : "dev";
  const url =
    mode === "dev"
      ? "https://apim.doctorassistant.ai/api/sandbox/consultations"
      : "https://apim.doctorassistant.ai/api/production/consultations";

  const formData = new FormData();
  formData.append("recording", audioBlob);
  if (specialty) {
    formData.append("specialty", specialty);
  }

  const metadataObj = metadata ? JSON.parse(metadata) : {};
  metadataObj.daai = { version, origin: 'consultation-recorder-component' };
  formData.append("metadata", JSON.stringify(metadataObj));

  formData.append("professionalId", professional)

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
    console.error("Erro ao enviar o áudio:", err);
    if (typeof error === "function") {
      error(err);
    }
  }
};

export const openConfigModal = () => {
  state.openModalConfig = true;
};

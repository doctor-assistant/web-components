import state from "../store";
import { EventSourceManager } from "../utils/sse";

let mediaRecorder: MediaRecorder | null = null;
let localStream: MediaStream | null = null;


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
  let screenStream = null;
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

  const micStream = await navigator.mediaDevices.getUserMedia(constraints);
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
      console.error("Erro ao salvar ou recuperar áudio:", error);
    }
  };
  const audioChunks: Blob[] = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };
  mediaRecorder.onstop = () => handleRecordingStop(audioChunks);
 mediaRecorder.stop();
  state.status = "finished";
};
export const uploadAudio = async (audioBlob, apiKey, success, error, specialty, metadata, event, professional) => {
  console.log(professional,'professional')
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
  if (metadata) {
    formData.append("metadata", metadata);
  }

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
        success(response);
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

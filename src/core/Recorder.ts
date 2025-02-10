import { version } from '../../package.json';
import state from "../store";
import { EventSourceManager } from "../utils/sse";
import AudioManager from './AudioManager';

// Main MediaRecorder instance for handling the recording process
let mediaRecorder: MediaRecorder | null = null;
// Stream for screen sharing in remote/telemedicine mode (fallback)
let screenStream: MediaStream | null = null;

export const StartTutorial = () => {
  state.openTutorialPopup = true;
}

export const startRecording = async (isRemote: boolean, videoElement?: HTMLVideoElement) => {
  state.chooseModality = true;

  const audioManager = AudioManager.getInstance();
  let mixedStream: MediaStream;

  try {
    // Get microphone stream
    const micStream = await audioManager.getMicrophoneStream({
      deviceId: state.chosenMicrophone
        ? { exact: state.defaultMicrophone }
        : undefined,
    });

    if (isRemote) {
      state.telemedicine = true;
      if (videoElement) {
        try {
          // Get video audio stream
          const videoStream = await audioManager.connectVideoElement(videoElement);
          
          // Mix microphone and video audio streams
          mixedStream = audioManager.createMixedStream([micStream, videoStream]);
        } catch (error) {
          console.error('Erro ao capturar áudio do vídeo:', error);
          // Fallback to screen sharing
          try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ audio: true });
            mixedStream = audioManager.createMixedStream([micStream, screenStream]);
          } catch (screenError) {
            audioManager.cleanup();
            return (state.status = "initial");
          }
        }
      } else {
        try {
          screenStream = await navigator.mediaDevices.getDisplayMedia({ audio: true });
          mixedStream = audioManager.createMixedStream([micStream, screenStream]);
        } catch (error) {
          audioManager.cleanup();
          return (state.status = "initial");
        }
      }
    } else {
      // For non-telemedicine, just use microphone stream
      mixedStream = new MediaStream(micStream.getTracks());
    }

    state.openTutorialPopup = false;
    state.status = "recording";

    // Create and start MediaRecorder with the mixed stream
    mediaRecorder = new MediaRecorder(mixedStream);
    mediaRecorder.onstart = () => { };
    mediaRecorder.start();

  } catch (error) {
    console.error('Error starting recording:', error);
    audioManager.cleanup();
    return (state.status = "initial");
  }
};

export const pauseRecording = () => {
  if (mediaRecorder?.state === "recording") {
    mediaRecorder.pause();
    state.status = "paused";
  }
  if (mediaRecorder?.stream) {
    mediaRecorder.stream
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
  mediaRecorder.onstop = async () => {
    // Stop all tracks to remove browser recording indicator
    if (mediaRecorder.stream) {
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    // Clean up screen sharing if active
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      screenStream = null;
    }

    // Clean up all audio resources
    AudioManager.getInstance().cleanup();

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
  // Ensure metadata exists and add version
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

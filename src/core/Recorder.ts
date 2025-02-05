import { version } from '../../package.json';

import state from "../store";
import { EventSourceManager } from "../utils/sse";


// Main MediaRecorder instance for handling the recording process
let mediaRecorder: MediaRecorder | null = null;
// Primary MediaStream for recording - this is the single source of truth for active recording
let localStream: MediaStream | null = null;
// Stream for screen sharing in remote/telemedicine mode
let screenStream: MediaStream | null = null;
// Stream for video element audio in telemedicine mode
let videoElementStream: MediaStream | null = null;
// AudioContext instance for managing audio processing
let audioContext: AudioContext | null = null;
// Track the current MediaElementSourceNode to ensure proper cleanup
let currentVideoSource: MediaStreamAudioSourceNode | null = null;


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
  if (isRemote) {
    state.telemedicine = true;
    if (videoElement) {
      try {
        // Create new AudioContext only if it doesn't exist or is closed
        if (!audioContext || audioContext.state === 'closed') {
          audioContext = new AudioContext();
        }
        // Only create new source if we don't have one for this video element
        if (!currentVideoSource) {
          currentVideoSource = audioContext.createMediaElementSource(videoElement);
        }
        const destination = audioContext.createMediaStreamDestination();
        currentVideoSource.connect(destination);
        videoElementStream = destination.stream;
      } catch (error) {
        console.error('Erro ao capturar áudio do vídeo:', error);
        // Fallback to screen sharing
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

  // Get the main recording stream - this will be our single source of truth for the active recording
  const micStream = await navigator.mediaDevices.getUserMedia(constraints);
  // Store the stream for proper cleanup when recording finishes
  localStream = micStream;
  const composedStream = new MediaStream();
  const context = new AudioContext();
  const audioDestination = context.createMediaStreamDestination();

  if (isRemote) {
    if (videoElementStream?.getAudioTracks().length > 0) {
      const videoSource = context.createMediaStreamSource(videoElementStream);
      const videoGain = context.createGain();
      videoGain.gain.value = 1.0;
      videoSource.connect(videoGain).connect(audioDestination);
    } else if (screenStream?.getAudioTracks().length > 0) {
      const systemSource = context.createMediaStreamSource(screenStream);
      const systemGain = context.createGain();
      systemGain.gain.value = 1.0;
      systemSource.connect(systemGain).connect(audioDestination);
    }
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
    if (videoElementStream) {
      videoElementStream.getTracks().forEach(track => {
        track.stop();
      });
      videoElementStream = null;
    }
    // Clean up audio context and sources
    if (currentVideoSource) {
      currentVideoSource.disconnect();
      currentVideoSource = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
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

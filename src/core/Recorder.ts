import { version } from '../../package.json';

import state from "../store";
import { EventSourceManager } from "../utils/sse";

// WeakMap to store audio contexts and sources for video elements
const videoAudioContexts = new WeakMap<HTMLVideoElement, {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
}>();

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
let currentVideoSource: MediaElementAudioSourceNode | null = null;

// Function to clean up audio resources for a specific video element and global resources
const cleanupAudioResources = async (videoElement?: HTMLVideoElement) => {
  if (videoElement) {
    const existing = videoAudioContexts.get(videoElement);
    if (existing) {
      try {
        existing.source.disconnect();
        if (existing.context.state !== 'closed') {
          await existing.context.close();
        }
      } catch (error) {
        console.warn('Error cleaning up audio resources:', error);
      }
      videoAudioContexts.delete(videoElement);
    }
  }
  
  // Clean up global resources
  if (currentVideoSource) {
    try {
      currentVideoSource.disconnect();
    } catch (error) {
      console.warn('Error disconnecting current video source:', error);
    }
    currentVideoSource = null;
  }
  
  if (audioContext && audioContext.state !== 'closed') {
    try {
      await audioContext.close();
    } catch (error) {
      console.warn('Error closing audio context:', error);
    }
    audioContext = null;
  }
  
  // Reset stream
  if (videoElementStream) {
    videoElementStream.getTracks().forEach(track => track.stop());
    videoElementStream = null;
  }
};


export const StartTutorial = () => {
  state.openTutorialPopup = true;
}


export const startRecording = async (isRemote: boolean, videoElement?: HTMLVideoElement) => {
  state.chooseModality = true;

  // Clean up any existing audio resources before starting new recording
  await cleanupAudioResources(videoElement);

  // Get microphone stream first
  const micConstraints = {
    audio: {
      deviceId: state.chosenMicrophone
        ? { exact: state.defaultMicrophone }
        : undefined,
    },
  };

  const micStream = await navigator.mediaDevices.getUserMedia(micConstraints);
  localStream = micStream;

  if (isRemote) {
    state.telemedicine = true;
    if (videoElement) {
      try {
        audioContext = new AudioContext();
        currentVideoSource = audioContext.createMediaElementSource(videoElement);
        const destination = audioContext.createMediaStreamDestination();
        currentVideoSource.connect(destination);
        videoElementStream = destination.stream;
        
        // Store references in WeakMap for cleanup
        videoAudioContexts.set(videoElement, {
          context: audioContext,
          source: currentVideoSource
        });
      } catch (error) {
        console.error('Erro ao capturar áudio do vídeo:', error);
        // Clean up any partially created resources
        await cleanupAudioResources(videoElement);
        // Clean up mic stream
        micStream.getTracks().forEach(track => track.stop());
        localStream = null;
        // Fallback to screen sharing
        try {
          screenStream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
          });
        } catch (screenError) {
          return (state.status = "initial");
        }
      }
    } else {
      try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
        });
      } catch (error) {
        // Clean up mic stream
        micStream.getTracks().forEach(track => track.stop());
        localStream = null;
        return (state.status = "initial");
      }
    }
  }

  state.openTutorialPopup = false;
  state.status = "recording";

  // Create final composed stream with all audio sources
  const composedStream = new MediaStream();
  const mixingContext = new AudioContext();
  const mixingDestination = mixingContext.createMediaStreamDestination();

  // Add microphone audio
  if (micStream?.getAudioTracks().length > 0) {
    const micSource = mixingContext.createMediaStreamSource(micStream);
    const micGain = mixingContext.createGain();
    micGain.gain.value = 1.0;
    micSource.connect(micGain).connect(mixingDestination);
  }

  // Add video or screen audio if available
  if (isRemote) {
    if (videoElementStream?.getAudioTracks().length > 0) {
      const videoSource = mixingContext.createMediaStreamSource(videoElementStream);
      const videoGain = mixingContext.createGain();
      videoGain.gain.value = 1.0;
      videoSource.connect(videoGain).connect(mixingDestination);
    } else if (screenStream?.getAudioTracks().length > 0) {
      const screenSource = mixingContext.createMediaStreamSource(screenStream);
      const screenGain = mixingContext.createGain();
      screenGain.gain.value = 1.0;
      screenSource.connect(screenGain).connect(mixingDestination);
    }
  }

  // Add all audio tracks to the final stream
  mixingDestination.stream.getAudioTracks().forEach(track => composedStream.addTrack(track));

  // Create and start MediaRecorder
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
  mediaRecorder.onstop = async () => {
    // Stop all tracks to remove browser recording indicator
    if (mediaRecorder.stream) {
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    // Clean up localStream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream = null;
    }
    // Clean up screen sharing if active
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      screenStream = null;
    }
    if (videoElementStream) {
      videoElementStream.getTracks().forEach(track => track.stop());
      videoElementStream = null;
    }

    // Clean up audio resources using the cleanup function
    // This will handle both WeakMap references and global resources
    if (currentVideoSource?.mediaElement) {
      await cleanupAudioResources(currentVideoSource.mediaElement as HTMLVideoElement);
    } else {
      await cleanupAudioResources();
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

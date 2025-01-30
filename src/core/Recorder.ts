import { version } from '../../package.json';

import state from "../store";
import { EventSourceManager } from "../utils/sse";

const VERSION = version;


let mediaRecorder: MediaRecorder | null = null;

let localStream: MediaStream | null = null;

let screenStream: MediaStream | null = null;

let currentRecordingTime = 0;


export const StartTutorial = () => {
  state.openTutorialPopup = true;
}



interface RecordingOptions {
  maxDuration?: number;
  remainingWarningTime?: number;
  onRemainingWarning?: () => void;
}

export const startRecording = async (isRemote: boolean, options?: RecordingOptions, apikey?:string, onSuccess?:any, onError?:any,    specialty?:any,
  metadata?:any,
  onEvent?:any,
  professional?:any,) => {
  state.chooseModality = true;


  // Validate duration parameters
  if (options?.maxDuration !== undefined) {
    console.log(options?.maxDuration,'options?.maxDuration', typeof options?.maxDuration)
    if (!Number.isFinite(options.maxDuration) || options.maxDuration <= 0) {
      throw new Error('maxDuration deve ser um número positivo');
    }

    if (options.remainingWarningTime !== undefined) {
      if (!Number.isFinite(options.remainingWarningTime) || options.remainingWarningTime <= 0) {
        throw new Error('remainingWarningTime deve ser um número positivo');
      }
      if (options.remainingWarningTime >= options.maxDuration) {
        throw new Error('remainingWarningTime deve ser menor que maxDuration');
      }
    }
  }

  // Calculate warning time if maxDuration is set (default to 10% of maxDuration)
  const warningTime = options?.maxDuration !== undefined
    ? Math.floor(options.remainingWarningTime ?? (options.maxDuration * 0.1))
    : undefined;

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

  // Use timeslice to get regular ondataavailable events for accurate time tracking
  let warningFired = false;

  mediaRecorder.ondataavailable = (event) => {
    console.log(event,'event')
    if (event.data.size > 0) {
      if (mediaRecorder?.state === "recording") {
        currentRecordingTime++;
       state.recordingTime = currentRecordingTime;
        console.log(options?.maxDuration,'options?.maxDuration')
        if (options?.maxDuration) {
          const timeRemaining = options.maxDuration - currentRecordingTime;

          if (!warningFired && warningTime && timeRemaining <= warningTime) {
            warningFired = true;
            options.onRemainingWarning?.();
          }

          console.log(timeRemaining,'timeRemaining')
          console.log(timeRemaining <= 0, 'timeRemaining <= 0')
          if (timeRemaining <= 0) {

            finishRecording(
              apikey,
              onSuccess,
              onError,
              specialty,
              metadata,
              onEvent,
              professional,
            );
          }
        }
      }
    }
  };
  mediaRecorder.start(1000);
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

export const uploadAudio = async (audioBlob, apiKey, success, error, specialty, metadata, event, professional) => {

  console.log(audioBlob,'audioBlob')

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
  metadataObj.daai  = {version:VERSION, origin:'consultation-recorder-component'};
  formData.append("metadata", JSON.stringify(metadataObj));

  formData.append("professionalId",professional)

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

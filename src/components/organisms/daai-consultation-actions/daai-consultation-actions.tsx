import { Component, h, Prop, State } from "@stencil/core";
import state from "../../../Store/RecorderComponentStore";

@Component({
  tag: "daai-consultation-actions",
  styleUrl: "daai-consultation-actions.css",
  shadow: false,
})
export class DaaiConsultationActions {
  @Prop() apiKey: string;
  @Prop() specialty: string;
  @Prop() onSuccess: (response: any) => void;
  @Prop() onError: (error: any) => void;
  @Prop() metadata: string;

  @State() error: string = "";
  @State() localStream: MediaStream | null = null;
  @State() mode: "local" | "telemedicine" | null = null;
  @State() mediaRecorder: MediaRecorder | null = null;

  async choosenMode() {
    state.status = "choosen";
  }

  async startRecordingLocal() {
    state.chooseModality = true;
    state.status = "recording";
    this.mode = "local";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: state.chosenMicrophone
            ? { exact: state.defaultMicrophone }
            : undefined,
        },
      });

      this.initializeMediaRecorder(stream);
    } catch (error) {
      this.error = "Erro ao acessar o microfone.";
      console.error(error);
    }
  }

  async startRecordingTelemedicine() {
    this.mode = "telemedicine";
    this.error = "";

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      });
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      state.status = "recording";
      const composedStream = this.mergeStreams(screenStream, micStream);
      this.initializeMediaRecorder(composedStream);
    } catch (err) {
      console.error(err);
      this.error = "Erro ao acessar o áudio da telemedicina.";
    }
  }

  mergeStreams(screenStream: MediaStream, micStream: MediaStream): MediaStream {
    const context = new AudioContext();
    const audioDestination = context.createMediaStreamDestination();

    const addAudioTrack = (stream: MediaStream) => {
      const source = context.createMediaStreamSource(stream);
      const gainNode = context.createGain();
      gainNode.gain.value = 1.0;
      source.connect(gainNode).connect(audioDestination);
    };

    if (screenStream.getAudioTracks().length) addAudioTrack(screenStream);
    if (micStream.getAudioTracks().length) addAudioTrack(micStream);

    return audioDestination.stream;
  }

  initializeMediaRecorder(stream: MediaStream) {
    this.localStream = stream;
    this.mediaRecorder = new MediaRecorder(stream);

    const audioChunks: Blob[] = [];
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      await this.uploadAudio(audioBlob);
    };

    this.mediaRecorder.start();
  }

  pauseRecording() {
    if (this.mediaRecorder?.state === "recording") {
      this.mediaRecorder.pause();
      state.status = "paused";
    }
  }

  resumeRecording() {
    if (this.mediaRecorder?.state === "paused") {
      this.mediaRecorder.resume();
      state.status = "recording";
    }
  }

  finishRecording() {
    if (this.mediaRecorder?.state === "recording") {
      this.mediaRecorder.stop();
      state.status = "finished";
    }
  }

  async uploadAudio(audioBlob: Blob) {
    const url =
      process.env.MODE_API === "dev"
        ? "https://apim.doctorassistant.ai/api/sandbox/consultations"
        : "https://apim.doctorassistant.ai/api/production/consultations";

    const formData = new FormData();
    formData.append("recording", audioBlob);
    formData.append("specialty", this.specialty);
    if (this.metadata)
      formData.append("metadata", JSON.stringify(this.metadata));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "x-daai-api-key": this.apiKey },
        body: formData,
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        this.onSuccess?.(jsonResponse);
      } else {
        const errorResponse = await response.json();
        this.onError?.(errorResponse);
      }
    } catch (error) {
      console.error("Erro ao enviar o áudio:", error);
      this.onError?.(error);
    }
  }

  renderButtons() {
    switch (state.status) {
      case "initial":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon id="specialty">
              <daai-stethoscope-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              id="start-recording"
              onClick={() => this.choosenMode()}
            >
              <daai-mic-icon />
            </daai-button-with-icon>
            <daai-button-with-icon id="button-support">
              <daai-support-icon />
            </daai-button-with-icon>
          </div>
        );
      case "choosen":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              id="choose-local-consultation"
              onClick={() => this.startRecordingLocal()}
            >
              Presencial
            </daai-button-with-icon>
            <daai-button-with-icon
              id="choose-telemedicine-consultation"
              onClick={() => this.startRecordingTelemedicine()}
            >
              Telemedicina
            </daai-button-with-icon>
          </div>
        );
      case "recording":
      case "resume":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              id="pause-recording"
              onClick={() => this.pauseRecording()}
            >
              <daai-pause-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              id="button-finish"
              onClick={() => this.finishRecording()}
            >
              <daai-finish-recording-icon />
            </daai-button-with-icon>
          </div>
        );
      case "paused":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon id="pause-recording-disabled" disabled>
              <daai-pause-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              id="button-resume"
              onClick={() => this.resumeRecording()}
            >
              <daai-resume-recording-icon />
            </daai-button-with-icon>
          </div>
        );
      case "finished":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              id="start-recording"
              onClick={() => this.startRecordingLocal()}
            >
              <daai-mic-icon />
            </daai-button-with-icon>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    return <div>{this.renderButtons()}</div>;
  }
}

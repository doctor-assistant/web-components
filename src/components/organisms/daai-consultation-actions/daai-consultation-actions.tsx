import { Component, h, Prop, State } from "@stencil/core";
import state from "../../../Store/RecorderComponentStore";

@Component({
  tag: "daai-consultation-actions",
  styleUrl: "daai-consultation-actions.css",
  shadow: false,
})
export class DaaiConsultationActions {
  @Prop() apikey: string;
  @Prop() specialty: string;
  @Prop() success: (response: any) => void;
  @Prop() error: (error: any) => void;
  @Prop() metadata: string;

  @State() localStream: MediaStream | null = null;
  @State() mode: "local" | "telemedicine" | null = null;
  @State() mediaRecorder: MediaRecorder | null = null;

  newRecording() {
    state.status = "initial";
  }

  async choosenMode() {
    state.status = "choosen";
  }

  choosenSpecialty() {
    state.openModalSpecialty = true;
  }

  startRecordingLocal = async (isRemote: boolean) => {
    state.chooseModality = true;
    state.status = "recording";

    this.mode = "local";
    const constraints = {
      audio: {
        deviceId: state.chosenMicrophone
          ? { exact: state.defaultMicrophone }
          : undefined,
      },
    };
    let screenStream = null;
    if (isRemote) {
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      });
    }

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

    this.mediaRecorder = new MediaRecorder(composedStream);

    this.mediaRecorder.onstart = () => {};
    this.mediaRecorder.start();
  };

  pauseRecording() {
    if (this.mediaRecorder?.state === "recording") {
      this.mediaRecorder.pause();
      state.status = "paused";
    }
    if (this.localStream) {
      this.localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = false));
      state.status = "paused";
    }
  }

  resumeRecording() {
    if (this.mediaRecorder?.state === "paused") {
      this.mediaRecorder.resume();
      state.status = "resume";
    }
  }

  finishRecording = async () => {
    const handleRecordingStop = async (audioChunks: Blob[]) => {
      try {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        await this.uploadAudio(
          audioBlob,
          this.apikey,
          this.success,
          this.error,
          this.specialty,
          "dev",
          this.metadata
        );
      } catch (error) {
        console.error("Erro ao salvar ou recuperar áudio:", error);
      }
    };
    const audioChunks: Blob[] = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    this.mediaRecorder.onstop = () => handleRecordingStop(audioChunks);
    this.mediaRecorder.stop();
    state.status = "finished";
  };

  async uploadAudio(
    audioBlob,
    apiKey,
    onSuccess,
    onError,
    specialty,
    modeApi,
    metadata
  ) {
    const url =
      modeApi === "dev"
        ? "https://apim.doctorassistant.ai/api/sandbox/consultations"
        : "https://apim.doctorassistant.ai/api/production/consultations";

    const formData = new FormData();
    formData.append("recording", audioBlob);
    formData.append("specialty", specialty);
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
        if (typeof onError === "function") {
          onError("Erro na requisição", errorResponse);
        }
        return;
      }

      if (response.ok) {
        const jsonResponse = await response.json();
        state.status = "upload-ok";
        if (typeof onSuccess === "function") {
          onSuccess(jsonResponse);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar o áudio:", error);
      if (typeof onError === "function") {
        onError("erro na requisição", error);
      }
    }
  }

  renderButtons() {
    switch (state.status) {
      case "initial":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              title="Especialidade:"
              id="specialty"
              onClick={this.choosenSpecialty}
            >
              <daai-stethoscope-icon />
            </daai-button-with-icon>
            <daai-button-with-icon title="Suporte" id="button-support">
              <daai-support-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              title="Iniciar Registro"
              id="start-recording"
              onClick={() => this.choosenMode()}
            >
              <daai-mic-icon />
            </daai-button-with-icon>
          </div>
        );
      case "choosen":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              title="Iniciar Registro Presencial"
              id="choose-local-consultation"
              onClick={() => this.startRecordingLocal(false)}
            >
              Presencial
            </daai-button-with-icon>
            <daai-button-with-icon
              title="Iniciar Registro Telemedicina"
              id="choose-telemedicine-consultation"
              onClick={() => this.startRecordingLocal(true)}
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
              title="Pausar Registro"
              id="pause-recording"
              onClick={() => this.pauseRecording()}
            >
              <daai-pause-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              title="Finalizar Registro"
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
            <daai-button-with-icon
              title="Pausar Registro"
              id="pause-recording-disabled"
              disabled
            >
              <daai-pause-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              title="Retomar Registro"
              id="button-resume"
              onClick={() => this.resumeRecording()}
            >
              <daai-resume-recording-icon />
            </daai-button-with-icon>
          </div>
        );
      case "upload-ok":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              title="Iniciar Novo Registro"
              id="start-recording"
              onClick={() => this.newRecording()}
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

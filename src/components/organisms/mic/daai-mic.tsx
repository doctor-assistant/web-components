import { Component, Event, EventEmitter, h, State } from "@stencil/core";
import state, { onChange } from "../../../store";

@Component({
  tag: "daai-mic",
  styleUrl: "daai-mic.css",
  shadow: false,
})
export class DaaiMic {
  @Event() interfaceEvent: EventEmitter<{ microphoneSelect: boolean }>;
  @State() showAnimation = false;
  micTexts = {
    initial: "Assistente de IA",
    choosen: "Consulta",
    recording: "Gravando...",
    resume: "Gravando...",
    paused: "Pausado",
    preparing: "Preparando para iniciar o seu registro...",
    finished: "Aguarde enquanto finalizamos sua consulta...",
    upload: "Registro Finalizado!",
  };

  connectedCallback() {
    this.requestMicrophonePermission();
  }

  async requestMicrophonePermission() {
    let tempStream: MediaStream | null = null;
    try {
      // Create a temporary stream just for permission check and device enumeration
      // This stream will be stopped immediately after getting the device list
      tempStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      state.microphonePermission = true;

      // Get the list of available audio devices
      const devices = await navigator.mediaDevices.enumerateDevices();

      if (devices.length === 0) {
        state.microphonePermission = false;
        return;
      }

      const microphones = devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => device.label || "Microfone sem nome");

      state.availableMicrophones = microphones;

      // Set the default microphone to the one saved in local storage, if it exists
      const storedMicrophone = localStorage.getItem("selectedMicrophone");
      const storedMicrophoneIsAvailable = devices.some(
        (device) => device.deviceId === storedMicrophone
      );
      if (storedMicrophone && storedMicrophoneIsAvailable) {
        state.defaultMicrophone = storedMicrophone;
      } else {
        state.defaultMicrophone = devices.some(
          (device) => device.deviceId === "default"
        )
          ? "default"
          : devices[0].deviceId;
      }

      // Always stop the temporary stream immediately after getting permissions and device list
      // This ensures we don't keep any lingering streams that could affect the recording indicator
      if (tempStream) {
        tempStream.getTracks().forEach((track) => track.stop());
        tempStream = null;
      }
    } catch (error) {
      console.error("Erro:", error);
      state.microphonePermission = false;
    } finally {
      // Ensure stream is always cleaned up, even if an error occurred
      if (tempStream) {
        tempStream.getTracks().forEach((track) => track.stop());
        tempStream = null;
      }
    }
  }

  watchStatus() {
    this.showAnimation = ["recording", "resume", "paused"].includes(
      state.status
    );
  }

  componentWillLoad() {
    onChange("status", () => this.watchStatus());
  }

  render() {
    return (
      <div class="flex items-center justify-center gap-2">
        <div id="daai-logo-icon"></div>
        <div class="flex items-center justify-center">
          {state.microphonePermission === false ? (
            <daai-text
              text="Aguardando autorização do microfone"
              id="error-msg"
            />
          ) : state.status === "upload-error" ? (
            <div>
              <daai-text text="Sua consulta não foi enviada!" id="error-text" />
              <daai-text
                text="Verifique sua conexão com a internet e tente enviar novamente."
                id="secondary-text"
              />
            </div>
          ) : state.status === "report-schema-error" ? (
            <div>
              <daai-text text="Erro ao validar o esquema de relatório" id="error-text" />
            </div>
          ) : (
            <div class="flex items-center justify-center">
              <daai-text
                text={this.micTexts[state.status]}
                id={state.status}
                class="initial-text"
              ></daai-text>
              {this.showAnimation && (
                <div class="ml-4">
                  <daai-recording-animation
                    id="animation-recording"
                    status={state.status}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {state.microphonePermission === true && state.status === "initial" && (
          <div></div>
        )}
      </div>
    );
  }
}

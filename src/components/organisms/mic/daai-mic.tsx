import { Component, Event, EventEmitter, h } from "@stencil/core";
import state from "../../../store";

@Component({
  tag: "daai-mic",
  styleUrl: "daai-mic.css",
  shadow: false,
})
export class DaaiMic {
  @Event() interfaceEvent: EventEmitter<{ microphoneSelect: boolean }>;

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

      const microphones = devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => device.label || "Microfone sem nome");

      state.availableMicrophones = microphones;

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
          ) : state.status === "initial" ? (
            <daai-text text="Assistente de IA" id="initial-text"></daai-text>
          ) : state.status === "paused" ? (
            <div class="flex items-center justify-center">
              <daai-text text="Pausado" id="initial-text"></daai-text>
              <div class="ml-4">
                <daai-recording-animation
                  id="animation-recording"
                  status={state.status}
                />
              </div>
            </div>
          ) : state.status === "upload-error" ? (
            <div>
              <daai-text text="Sua consulta não foi enviada!" id="error-text" />
              <daai-text
                text="Verifique sua conexão com a internet e tente enviar novamente."
                id="secondary-text"
              />
            </div>
          ) : null}

          {state.status === "recording" || state.status === "resume" ? (
            <div class="flex items-center justify-center">
              <daai-text text="Gravando..." id="initial-text"></daai-text>
              <div class="ml-4">
                <daai-recording-animation
                  id="animation-recording"
                  status={state.status}
                />
              </div>
            </div>
          ) : null}
        </div>
        {state.microphonePermission === true && state.status === "initial" && (
          <div></div>
        )}
      </div>
    );
  }
}

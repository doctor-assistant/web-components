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
    console.log("Solicitando permissão do microfone...");
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log("Permissão concedida, stream:", stream);

      state.microphonePermission = true;

      console.log("state.microphonePermission", state.microphonePermission);

      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("Dispositivos disponíveis:", devices);

      const microphones = devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => device.label || "Microfone sem nome");

      console.log("Microfones encontrados:", microphones);

      state.availableMicrophones = microphones;

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log("Erro ao solicitar permissão do microfone");
      console.error("Erro:", error);
      state.microphonePermission = false;
    }
  }

  render() {
    return (
      <div class="flex items-center justify-center bg-white gap-2">
        <div id="daai-logo-icon"></div>
        <div class="flex items-center justify-center">
          {state.microphonePermission === false ? (
            <daai-text
              text="Aguardando autorização do microfone"
              id="error-msg"
            />
          ) : state.status === "initial" ? (
            <daai-text text="Registro por IA" id="initial-text"></daai-text>
          ) : state.status === "recording" ||
            state.status === "paused" ||
            state.status === "resume" ? (
            <div class="ml-4">
              <daai-recording-animation
                id="animation-recording"
                status={state.status}
              />
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

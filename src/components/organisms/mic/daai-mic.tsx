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
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      state.microphonePermission = true;

      const devices = await navigator.mediaDevices.enumerateDevices();

      const microphones = devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => device.label || "Microfone sem nome");

      state.availableMicrophones = microphones;

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
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

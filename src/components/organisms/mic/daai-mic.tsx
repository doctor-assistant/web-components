import { Component, Event, EventEmitter, h } from "@stencil/core";
import state from "../../../Store/RecorderComponentStore";

@Component({
  tag: "daai-mic",
  styleUrl: "daai-mic.css",
  shadow: false,
})
export class DaaiMic {
  @Event() interfaceEvent: EventEmitter<{ microphoneSelect: boolean }>;

  async componentDidLoad() {
    await this.requestMicrophonePermission();
  }

  async requestMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.microphonePermission = true;

      const devices = await navigator.mediaDevices.enumerateDevices();
      const microphones = devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => device.label || "Microfone sem nome");

      state.availableMicrophones = microphones;

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Permissão do microfone negada ou erro ao acessar:", error);
    }
  }

  handleClick = () => {
    this.interfaceEvent.emit({ microphoneSelect: true });
    state.openModalConfig = true;
  };

  render() {
    return (
      <div class="flex items-center justify-center bg-white">
        <daai-logo-icon></daai-logo-icon>
        <div class="flex items-center justify-center">
          {state.microphonePermission === false ? (
            <daai-text
              text="Aguardando autorização do microfone"
              id="error-msg"
            />
          ) : state.status === "initial" ? (
            <div class="mt-4">
              <daai-mic-animation id="animation-test" />
            </div>
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
          <daai-button-with-icon id="config-mic" onClick={this.handleClick}>
            <daai-config-mic-icon></daai-config-mic-icon>
          </daai-button-with-icon>
        )}
      </div>
    );
  }
}

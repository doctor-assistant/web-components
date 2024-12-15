import { Component, h, Prop, State } from "@stencil/core";
import state from "../../../Store/RecorderComponentStore";

@Component({
  tag: "daai-modal",
  styleUrl: "daai-modal.css",
  shadow: true,
})
export class DaaiModal {
  @Prop() items = [];
  @Prop() headerTitle = "";

  @State() devices: MediaDeviceInfo[] = [];
  @State() selectedMicrophone: string = "";

  async componentDidLoad() {
    await this.loadAudioDevices();
    this.setPreselectedMicrophone();
  }

  async loadAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );
    this.devices = audioDevices;
  }

  setPreselectedMicrophone() {
    const defaultMicrophone = state.defaultMicrophone;
    if (defaultMicrophone) {
      this.selectedMicrophone = defaultMicrophone;
    }
  }

  toggleSelection(deviceId: string) {
    this.selectedMicrophone = deviceId;
  }

  setDefaultMicrophone() {
    if (this.selectedMicrophone) {
      state.defaultMicrophone = this.selectedMicrophone;
      state.openModalConfig = false;
    }
  }

  handleClick() {
    state.openModalConfig = false;
  }

  render() {
    return (
      <div class="w-96 p-4 rounded-md border-2 border-gray-200 mt-4">
        <div class="flex gap-32 space-x-8">
          <p class="text-md text-gray-600 mb-4">{this.headerTitle}</p>
          <daai-button
            class="text-black font-medium  text-sm mb-4"
            onClick={() => this.handleClick()}
          >
            X
          </daai-button>
        </div>
        <div class="w-full h-64 overflow-y-auto border p-4">
          <ul class="space-y-2">
            {this.devices.map((device) => (
              <li
                class={`cursor-pointer p-3 rounded-lg border transition
                  ${
                    this.selectedMicrophone === device.deviceId
                      ? "bg-gray-500 text-white border-gray-600"
                      : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                  }`}
                onClick={() => this.toggleSelection(device.deviceId)}
              >
                {device.label || "Microfone desconhecido"}
              </li>
            ))}
          </ul>
        </div>
        <div class="flex items-start justify-start gap-2 mt-2">
          <daai-button
            class="text-white bg-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            onClick={this.setDefaultMicrophone.bind(this)}
          >
            Escolher microfone
          </daai-button>
        </div>
      </div>
    );
  }
}

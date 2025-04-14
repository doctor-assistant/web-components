import { Component, h, Prop, State } from "@stencil/core";
import state from "../../../store";

@Component({
  tag: "daai-modal",
  styleUrl: "daai-modal.css",
  shadow: false,
})
export class DaaiModal {
  @Prop() items = [];
  @Prop() headerTitle = "";

  @State() devices: MediaDeviceInfo[] = [];
  @State() selectedMicrophone: string = "";

  componentDidRender() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.handleClick();
    }
  };

  async componentDidLoad() {
    await this.loadAudioDevices();
    this.setPreselectedMicrophone();
  }

  async loadAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const rawAudioDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );
    const audioDevices = rawAudioDevices.sort((a, b) => {
      if (a.deviceId === 'default') return -1;
      if (b.deviceId === 'default') return 1;
      return 0;
    });
    this.devices = audioDevices;
  }

  setPreselectedMicrophone() {
    const defaultMicrophone = state.defaultMicrophone;
    const selectedMicrophone = localStorage.getItem('selectedMicrophone');
    const defaultSystemMicrophone = this.devices.find(
      (device) => device.label.startsWith("Default")
    );
    if (defaultMicrophone) {
      this.selectedMicrophone = defaultMicrophone;
    }
    else if (selectedMicrophone) {
      this.selectedMicrophone = selectedMicrophone
    }
    else if (defaultSystemMicrophone) {
      this.selectedMicrophone = defaultSystemMicrophone.deviceId;
    }
  }

  setDefaultMicrophone(deviceId: string) {
    this.selectedMicrophone = deviceId;
    localStorage.setItem('selectedMicrophone', deviceId);
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
      <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm tw-z-[9999]">
        <div class="w-96 px-5 pt-5 pb-8 rounded-md mt-4 bg-white tw-z-[9999]">
          <div class="flex justify-between">
            <span class="text-[12px] font-[600] modal-title" id="mic-title">{this.headerTitle}</span>
            <daai-button
              class="text-black font-medium text-sm mb-4"
              onClick={() => this.handleClick()}
            >
              X
            </daai-button>
          </div>
          <div class="w-[calc(100%+18px)] h-64 overflow-y-scroll">
            <ul class="space-y-2 pr-1">
              {this.devices.map((device) => (
                <li
                  class={`cursor-pointer text-[12px] font-[600] p-3 rounded-lg border transition ${this.selectedMicrophone === device.deviceId ? 'selected-modal-item' : 'modal-item'}`}
                  onClick={() => this.setDefaultMicrophone(device.deviceId)}
                >
                  {device.label || "Microfone desconhecido"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

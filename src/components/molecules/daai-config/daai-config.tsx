import { Component, h, State } from "@stencil/core";
import { openConfigModal } from "../../../core/Recorder";
import state from "../../../store";

@Component({
  tag: "daai-config",
  styleUrl: "daai-config.css",
  shadow: true,
})
export class DaaiConfig {
  private popupRef: HTMLElement;
  @State() isOpen: boolean = true;

  handleClickTutorialButton() {
    window.open("https://doctorassistant.ai/tutorial/", "_blank");
  }

  handleClickOutside = (event: MouseEvent) => {
    if (this.popupRef && !this.popupRef.contains(event.target as Node)) {
      state.openMenu = false;
      state.isOpenMenuToCancelAnimation = true;
      localStorage.setItem(
        "isOpenMenuToCancelAnimation",
        JSON.stringify(state.isOpenMenuToCancelAnimation)
      );
    }
  };

  connectedCallback() {
    document.addEventListener("click", this.handleClickOutside);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  render() {
    const recorderElement = document.querySelector('daai-consultation-recorder');
    const yPosition = recorderElement ? recorderElement.getBoundingClientRect().top : 0;
    const xPosition = recorderElement ? recorderElement.getBoundingClientRect().right : 0;
    const screenWidth = window.innerWidth;

    const showTop = yPosition > 200;
    const showLeft = screenWidth - xPosition < 150;

    if (!state.openMenu) {
      return null;
    }

    return (
      <div
        class={`absolute bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg text-gray-500 z-50 
          ${showLeft && '-ml-[150px]'} ${showTop && !showLeft && '-mt-[100px]'} ${showTop && showLeft && '-mt-[120px]'}`}
        ref={(el) => (this.popupRef = el)}
      >
        <div class="flex flex-col gap-4 p-4 rounded-md border-2 border-gray-200 bg-white shadow-md rounded-lg">
          <daai-button-with-icon
            title="Configuração de microfone"
            id="config-mic"
            onClick={openConfigModal}
          >
            <div class="flex items-start justify-start gap-2">
              <daai-config-mic-icon></daai-config-mic-icon>
              <daai-text text="Configurações" class="font-bold"></daai-text>
            </div>
          </daai-button-with-icon>
          <daai-button-with-icon
            class="flex items-center gap-2"
            title="Suporte"
            id="button-support"
            onClick={this.handleClickTutorialButton}
          >
            <div class="flex items-start justify-start gap-2">
              <daai-menu-tutorial-icon />
              <daai-text text="Tutorial" class="font-bold"></daai-text>
            </div>
          </daai-button-with-icon>
        </div>
      </div>
    );
  }
}

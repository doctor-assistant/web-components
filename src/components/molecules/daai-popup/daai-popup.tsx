import { Component, h, Prop } from "@stencil/core";
import { startRecording } from "../../../core/Recorder";
import state from "../../../store";

@Component({
  tag: "daai-popup",
  styleUrl: "daai-popup.css",
  shadow: false,
})
export class DaaiPopup {
  @Prop() mode: string;
  @Prop() apikey: string;
  @Prop() professional: string;
  @Prop() metadata: Record<string, any>;
  handleClose() {
    state.openTutorialPopup = false;
  }
  render() {
    return (
      <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
        <div class="flex items-center justify-center flex-col gap-4 w-96 p-4 rounded-md border-2 border-gray-200 bg-white shadow-md">
          {/* <daai-popup-icon id="popup-icon"></daai-popup-icon> */}
          <div id="popup-icon"></div>
          <div class="flex items-center justify-center flex-col gap-2">
            <daai-text
              tag="h5"
              text="Compartilhar guia da consulta online"
              id="title"
            />
            <daai-text
              tag="h6"
              text="Para realizar o registro, você deve compartilhar o áudio da guia do navegador na qual a consulta será realizada."
              class="tutorial-text"
            />
            <daai-text
              tag="h5"
              class="alert-text"
              text="ATENÇÃO: é necessário compartilhar o áudio da guia, ainda que seja a mesma guia em que você se encontra agora."
            />
          </div>
          <div class="flex items-center mb-4"></div>
          <daai-checkbox label="Não mostrar novamente"></daai-checkbox>
          <div class="flex items-center gap-4">
            <daai-daai-button-with-icon
              id="daai-cancel-button"
              onClick={() => this.handleClose()}
            >
              Cancelar
            </daai-daai-button-with-icon>
            <daai-daai-button-with-icon
              id="daai-select-guide-button"
              onClick={() => startRecording({
                isRemote: true,
                mode: this.mode,
                apikey: this.apikey,
                professional: this.professional,
                metadata: this.metadata,
              })}
            >
              Selecionar guia
            </daai-daai-button-with-icon>
          </div>
        </div>
      </div>
    );
  }
}

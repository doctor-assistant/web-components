import { Component, h } from "@stencil/core";
import { startRecording } from "../../../core/Recorder";

@Component({
  tag: "daai-popup",
  styleUrl: "daai-popup.css",
  shadow: true,
})
export class DaaiPopup {
  render() {
    return (
      <div class="flex items-center justify-center flex-col gap-4 w-96 p-4 rounded-md border-2 border-gray-200 mt-4">
        <daai-popup-icon></daai-popup-icon>
        <daai-text text="Compartilhar guia da consulta online" />
        <daai-text text="Para realizar o registro, você deve compartilhar o áudio da guia do navegador na qual a consulta será realizada." />
        <daai-text text="ATENÇÃO: é necessário compartilhar o áudio da guia, ainda que seja a mesma guia em que você se encontra agora." />
        <div class="flex items-center mb-4"></div>
        <daai-checkbox label="Não mostrar novamente"></daai-checkbox>
        <div class="flex items-center gap-4">
          <daai-daai-button-with-icon id="daai-cancel-button">
            Cancelar
          </daai-daai-button-with-icon>
          <daai-daai-button-with-icon
            id="daai-select-guide-button"
            onClick={() => startRecording(true)}
          >
            Selecionar guia
          </daai-daai-button-with-icon>
        </div>
      </div>
    );
  }
}

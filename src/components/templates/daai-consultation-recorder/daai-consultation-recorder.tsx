import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'daai-consultation-recorder',
  styleUrl: 'daai-consultation-recorder.css',
  shadow: true,
})
export class DaaiConsultationRecorder {
  handleButtonClick = () => {
    console.log('Botão Enviar clicado!');
  };
  render() {
    return (
      <Host>
        <slot>
          <div class="bg-gray-200 p-6 rounded-md flex justify-center">
          <daai-button></daai-button>
          <daai-button-with-icon></daai-button-with-icon>
          </div>
        </slot>
      </Host>
    );
  }
}

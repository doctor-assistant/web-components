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
        <slot></slot>
      </Host>
    );
  }
}

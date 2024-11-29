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
          <div class="p-4 flex justify-center">
            <daai-button-with-icon type="primary" id='start-recording'>
              <span slot="icon"></span>
              Notificação
            </daai-button-with-icon>

            <daai-button-with-icon type="primary" id='pause-recording'>
              <span slot="icon">🔔</span>
            </daai-button-with-icon>
          </div>
        </slot>
      </Host>
    );
  }
}

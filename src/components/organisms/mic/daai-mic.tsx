import { Component, h } from '@stencil/core';

@Component({
  tag: 'daai-mic',
  styleUrl: 'daai-mic.css',
  shadow: true,
})
export class DaaiMic {
  render() {
    return (
        <div>
        <daai-button-with-icon type="primary" id='start-recording'>
              <span slot="icon"></span>
              Iniciar Registro
        </daai-button-with-icon>
        <daai-button-with-icon type="primary" id='pause-recording'>
              <span slot="icon">
                <daai-pause-icon></daai-pause-icon>
              </span>
          </daai-button-with-icon>
          </div>
    );
  }
}

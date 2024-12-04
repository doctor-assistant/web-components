import { Component, Host, h } from '@stencil/core';
import state from '../../../Store/RecorderComponentStore';

@Component({
  tag: 'daai-consultation-recorder',
  styleUrl: 'daai-consultation-recorder.css',
  shadow: true,
})
export class DaaiConsultationRecorder {
  render() {
    return (
      <Host>
        <slot>
          <div class='w-96 bg-white flex items-center justify-center p-2 rounded-lg border-4 border-gray-100'>
          <daai-mic></daai-mic>
          </div>
        </slot>
        {
          state.openModalConfig && <daai-modal headerTitle='Escolha o seu Microfone' items={state.availableMicrophones}/>
        }
      </Host>
    );
  }
}

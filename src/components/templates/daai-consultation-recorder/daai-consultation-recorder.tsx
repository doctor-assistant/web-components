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
          <div class='w-96 bg-red-600 flex items-center justify-center p-2 rounded-md'>
          <daai-mic></daai-mic>
          <daa-button-with-icon id='specialty'>
            <daai-stethoscope-icon/>
          </daa-button-with-icon>
          </div>
        </slot>
        {
          state.openModalConfig && <daai-modal headerTitle='Escolha o seu Microfone' items={state.availableMicrophones}/>
        }
      </Host>
    );
  }
}

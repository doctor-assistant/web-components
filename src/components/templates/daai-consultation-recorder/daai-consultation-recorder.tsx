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
        <div class="w-[330px] bg-white flex items-center justify-between rounded-lg border-4 border-gray-100 p-2">
          <daai-mic></daai-mic>
          <div class="ml-auto flex gap-2 items-center">
            {
            state.status === 'recording' || state.status === 'paused' || state.status === 'resume' ?
            <daai-clock/> : ''
            }
            <daai-consultation-actions></daai-consultation-actions>
          </div>
        </div>
      </slot>
        {
          state.openModalConfig && <daai-modal headerTitle='Escolha o seu Microfone' items={state.availableMicrophones}/>
        }
      </Host>
    );
  }
}

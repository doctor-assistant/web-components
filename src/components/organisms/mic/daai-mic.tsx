import { Component, h } from '@stencil/core';
import state from '../../../Store/RecorderComponentStore';

@Component({
  tag: 'daai-mic',
  styleUrl: 'daai-mic.css',
  shadow: false,
})
export class DaaiMic {
  render() {
    console.log(state.status,'state.status')
    return (
      <slot>
      <div class='flex items-center justify-center bg-white gap-4 w-3/5'>
        <daai-logo-icon></daai-logo-icon>
        <div class='flex items-center justify-center'>
            {
            state.status === 'initial' ? (
              <div class='mt-4'>
                <daai-mic-animation id='animation-test'/>
              </div>
            ) : (
              (state.status === 'recording' || state.status === 'paused') && (
                <daai-recording-animation
                  id='animation-recording'
                  status="recording"
                  animationRecordingColor="#F43F5E"
                  animationPausedColor="#009CB1"
                />
              )
            )
          }
        </div>
        <daai-button-with-icon id='start-recording'>
          <daai-config-mic-icon></daai-config-mic-icon>
        </daai-button-with-icon>
    </div>
    </slot>
    );
  }
}

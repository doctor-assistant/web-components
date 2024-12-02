import { Component, h } from '@stencil/core';

@Component({
  tag: 'daai-mic',
  styleUrl: 'daai-mic.css',
  shadow: false,
})
export class DaaiMic {
  render() {
    return (
      <slot>
      <div class='flex items-center justify-center'>
        <daai-logo-icon></daai-logo-icon>
        <daai-mic-animation></daai-mic-animation>
        <daai-recording-animation
        status="recording"
        animationRecordingColor="#F43F5E"
        animationPausedColor="#009CB1"
      ></daai-recording-animation>
        <daai-button-with-icon id='start-recording'>
          <daai-config-mic-icon></daai-config-mic-icon>
        </daai-button-with-icon>
    </div>
    </slot>
    );
  }
}

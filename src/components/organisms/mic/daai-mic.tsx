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
      <div class='flex items-center justify-center gap-4'>
      <daai-text text="Microfone" tag="p" id='daai-text'></daai-text>
      <daai-button-with-icon id="start-recording">
        <daai-mic-icon></daai-mic-icon>
      </daai-button-with-icon>
      <daai-button-with-icon id="pause-recording">
        <daai-pause-icon></daai-pause-icon>
      </daai-button-with-icon>
    </div>
    </slot>
    );
  }
}

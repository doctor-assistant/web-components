import { Component, Host, h } from '@stencil/core';

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
          <div class="bg-gray-200 p-6 rounded-md flex justify-center">
          <daai-logo-icon></daai-logo-icon>
          <daai-mic-icon></daai-mic-icon>
          <daai-pause-icon></daai-pause-icon>
          <daai-finish-recording-icon></daai-finish-recording-icon>
          <daai-support-icon></daai-support-icon>
          <daai-stethoscope-icon></daai-stethoscope-icon>
          <p>aqui</p>
          </div>
        </slot>
      </Host>
    );
  }
}

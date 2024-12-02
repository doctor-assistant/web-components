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
          <daai-mic></daai-mic>
        </slot>
      </Host>
    );
  }
}

import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'daai-text',
  styleUrl: 'daai-text.css',
  shadow: true,
})
export class DaaiText {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

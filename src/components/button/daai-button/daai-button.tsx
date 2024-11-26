import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'daai-button',
  styleUrl: 'daai-button.css',
  shadow: true,
})
export class DaaiButton {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

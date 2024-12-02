import { Component, Event, h } from '@stencil/core';

@Component({
  tag: 'daai-button',
  styleUrl: 'daai-button.css',
  shadow: true,
})
export class DaaiButton {
  @Event() onClick: (event: MouseEvent) => void = () => {};

  render() {
    return (
      <button
        type="button"
        onClick={this.onClick}
      >
        <slot></slot>
      </button>
    );
  }
}

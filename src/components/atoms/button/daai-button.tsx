import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'daai-button',
  styleUrl: 'daai-button.css',
  shadow: true,
})
export class DaaiButton {
  @Prop() customClass: string = '';
  @Prop() label: string = 'Click Me';
  @Prop() onClick: (event: MouseEvent) => void = () => {};

  render() {
    return (
      <button
        type="button"
        class={`${this.customClass}`}
        onClick={this.onClick}
      >
      </button>
    );
  }
}

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
        <span class="button-content">
          <slot name="icon"></slot>
          <span class="button-label">
            <slot></slot>
          </span>
        </span>
      </button>
    );
  }
}

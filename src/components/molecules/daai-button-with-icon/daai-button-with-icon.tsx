import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'daai-button-with-icon',
  styleUrl: 'daai-button-with-icon.css',
  shadow: true,
})
export class DaaiButtonWithIcon {
  @Prop() type: 'primary' | 'secondary' = 'primary';
  @Prop() disabled: boolean = false;

  render() {
    return (
      <div class="button-with-icon">
        <slot name="icon" />
        <daai-button>
          <slot />
        </daai-button>
      </div>
    );
  }
}

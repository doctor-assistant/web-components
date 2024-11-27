import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'daai-button-with-icon',
  styleUrl: 'daai-button-with-icon.css',
  shadow: true,
})
export class DaaiButtonWithIcon {
  @Prop() width: string = '150px';
  @Prop() height: string = '50px';
  @Prop() backgroundColor: string = '#b10058';
  @Prop() textColor: string = '#FFF';
  @Prop() borderRadius: string = '10px';
  @Prop() hoverBackgroundColor: string = '#477e86';
  @Prop() border: string = 'none';

  render() {
    return (
      <daai-button>
        <span class="button-content">
          <slot name="icon"></slot>
          <span class="button-label">
            <slot></slot>
          </span>
        </span>
      </daai-button>
    );
  }
}

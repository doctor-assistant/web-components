import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'daai-text',
  styleUrl: 'daai-text.css',
  shadow: true,
})
export class DaaiText {
  @Prop() text: string

  render() {
    return (
      <Host>
        <div>
          {this.text}
        </div>
      </Host>
    );
  }
}

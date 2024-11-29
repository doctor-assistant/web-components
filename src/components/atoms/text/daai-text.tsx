import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'daai-text',
  styleUrl: 'daai-text.css',
  shadow: true,
})
export class DaaiText {
  @Prop() text: string;
  @Prop() tag: keyof HTMLElementTagNameMap = 'p';

  render() {
    return (
      <this.tag>
        {this.text}
      </this.tag>
    );
  }
}


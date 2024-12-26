import { Component, Event, h, Prop } from "@stencil/core";

@Component({
  tag: "daai-button",
  styleUrl: "daai-button.css",
  shadow: true,
})
export class DaaiButton {
  @Prop() disabled: boolean = false;
  @Event() onClick: (event: MouseEvent) => void = () => {};

  render() {
    return (
      <button type="button" onClick={this.onClick} disabled={this.disabled}>
        <slot></slot>
      </button>
    );
  }
}

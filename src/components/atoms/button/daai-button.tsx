import { Component, Event, h, Prop } from "@stencil/core";

@Component({
  tag: "daai-button",
  styleUrl: "daai-button.css",
  shadow: false,
})
export class DaaiButton {
  @Prop() disabled: boolean = false;
  @Event() onClick: (event: MouseEvent) => void = () => { };

  render() {
    return (
      <button
        type="button"
        onClick={(e) => {
          if (!this.disabled) {
            this.onClick(e);
          }
        }}
        disabled={this.disabled}
      >
        <slot></slot>
      </button>
    );
  }
}

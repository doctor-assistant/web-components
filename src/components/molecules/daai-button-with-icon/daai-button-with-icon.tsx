import { Component, Event, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-button-with-icon",
  shadow: true,
})
export class DaaiButtonWithIcon {
  @Prop() disabled: boolean = false;
  @Event() onClick: (event: MouseEvent) => void = () => {};

  render() {
    return (
      <daai-button
        onClick={this.onClick}
        disabled={this.disabled}
        class="flex items-center justify-center"
      >
        <slot />
      </daai-button>
    );
  }
}

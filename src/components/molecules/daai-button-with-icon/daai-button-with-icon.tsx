import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-button-with-icon",
  shadow: true,
})
export class DaaiButtonWithIcon {
  @Prop() disabled: boolean = false;

  render() {
    return (
      <daai-button
        disabled={this.disabled}
        class="flex items-center justify-center"
      >
        <slot />
      </daai-button>
    );
  }
}

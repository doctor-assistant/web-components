import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-button-with-icon",
  shadow: true,
})
export class DaaiButtonWithIcon {
  @Prop() disabled: boolean = false;

  render() {
    return (
      <div class="button-with-icon">
        <slot name="icon" />
        <daai-button disabled={this.disabled}>
          <slot />
        </daai-button>
      </div>
    );
  }
}

import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-button-with-icon",
  styleUrl: "daai-button-with-icon.css",
  shadow: true,
})
export class DaaiButtonWithIcon {
  @Prop() disabled: boolean = false;

  render() {
    {
      console.log(this.disabled, "### desabilitado?");
    }
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

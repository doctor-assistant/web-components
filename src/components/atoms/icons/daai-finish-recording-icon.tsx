import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-finish-recording-icon",
  styleUrl: "",
  shadow: true,
})
export class DaaiFinishRecordingsIcon {
  @Prop() width: string = "24px";
  @Prop() height: string = "24px";
  @Prop() color: string = "white";

  render() {
    return (
      <div class="icon-container">
        <slot>
          <svg
            width={this.width}
            height={this.height}
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2.1582"
              y="2.00391"
              width="12"
              height="12"
              rx="1"
              fill={this.color}
            />
          </svg>
        </slot>
      </div>
    );
  }
}

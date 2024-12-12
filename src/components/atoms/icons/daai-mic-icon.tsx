import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-mic-icon",
  styleUrl: "",
  shadow: true,
})
export class DaaiMicIcon {
  @Prop() width: string = "26px";
  @Prop() height: string = "26px";
  @Prop() color: string = "white";

  render() {
    return (
      <div class="icon-container">
        <slot>
          <svg
            width={this.width}
            height={this.height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 8.5C4 8.5 4 12 8 12M8 12C12 12 12 8.5 12 8.5M8 12V14.5M6.5 14.5H9.5M8 1C6 1 6 3 6 3V8C6 8 6 10 8 10C10 10 10 8 10 8V3C10 3 10 1 8 1Z"
              stroke={this.color}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </slot>
      </div>
    );
  }
}

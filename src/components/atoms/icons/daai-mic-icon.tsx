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
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.46352 1.47093C4.46493 0.835461 3.1582 1.55278 3.1582 2.73642V11.2714C3.1582 12.455 4.46493 13.1724 5.46352 12.5369L12.1696 8.2694C13.0958 7.67997 13.0958 6.32785 12.1696 5.73841L5.46352 1.47093Z"
              fill="white"
            />
          </svg>
        </slot>
      </div>
    );
  }
}

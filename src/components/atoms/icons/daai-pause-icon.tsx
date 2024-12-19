import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-pause-icon",
  styleUrl: "",
  shadow: true,
})
export class DaaiPauseIcon {
  @Prop() width: string = "14px";
  @Prop() height: string = "14px";
  @Prop() color: string = "white";

  render() {
    return (
      <div class="icon-container">
        <slot>
          <svg
            width={this.width}
            height={this.height}
            viewBox="0 0 10 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.668213 1.57089C0.668213 0.880755 1.22768 0.321289 1.91782 0.321289H2.54262C3.23275 0.321289 3.79222 0.880755 3.79222 1.57089V10.3181C3.79222 11.0082 3.23275 11.5677 2.54262 11.5677H1.91781C1.22768 11.5677 0.668213 11.0082 0.668213 10.3181V1.57089Z"
              fill={this.color}
            />
            <path
              d="M6.2915 1.57089C6.2915 0.880755 6.85097 0.321289 7.54111 0.321289H8.16591C8.85604 0.321289 9.41551 0.880755 9.41551 1.57089V10.3181C9.41551 11.0082 8.85604 11.5677 8.16591 11.5677H7.54111C6.85097 11.5677 6.2915 11.0082 6.2915 10.3181V1.57089Z"
              fill={this.color}
            />
          </svg>
        </slot>
      </div>
    );
  }
}

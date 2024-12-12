import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-finish-recording-icon",
  styleUrl: "",
  shadow: true,
})
export class DaaiFinishRecordingsIcon {
  @Prop() width: string = "24px";
  @Prop() height: string = "24px";
  @Prop() color: string = "#009CB1";

  render() {
    return (
      <div class="icon-container">
        <slot>
          <svg
            width={this.width}
            height={this.height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.7464 5.5371L8.62682 15.6566L5.25363 12.2835C4.73021 11.76 3.91599 11.76 3.39257 12.2835C2.86914 12.8069 2.86914 13.6211 3.39257 14.1445L7.69628 18.4482C7.92892 18.6809 8.27787 18.8554 8.62682 18.8554C8.97577 18.8554 9.32472 18.739 9.55735 18.4482L20.6074 7.39817C21.1309 6.87474 21.1309 6.06052 20.6074 5.5371C20.084 5.01368 19.2698 5.01368 18.7464 5.5371Z"
              fill={this.color}
            />
          </svg>
        </slot>
      </div>
    );
  }
}

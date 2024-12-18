import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-resume-recording-icon",
  styleUrl: "",
  shadow: true,
})
export class DaaiResumeRecordingIcon {
  @Prop() width: string = "16px";
  @Prop() height: string = "16px";
  @Prop() color: string = "white";

  render() {
    return (
      <div class="icon-container">
        <slot>
          <svg
            id="pause-icon"
            width={this.width}
            height={this.height}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 1.00391C6.4087 1.00391 4.88258 1.63605 3.75736 2.76127C2.63214 3.88648 2 5.41261 2 7.00391H0L2.64 9.69057L5.33333 7.00391H3.33333C3.33333 5.76623 3.825 4.57924 4.70017 3.70407C5.57534 2.8289 6.76232 2.33724 8 2.33724C9.23768 2.33724 10.4247 2.8289 11.2998 3.70407C12.175 4.57924 12.6667 5.76623 12.6667 7.00391C12.6667 8.24158 12.175 9.42857 11.2998 10.3037C10.4247 11.1789 9.23768 11.6706 8 11.6706C6.71333 11.6706 5.54667 11.1439 4.70667 10.2972L3.76 11.2439C4.84667 12.3372 6.33333 13.0039 8 13.0039C9.5913 13.0039 11.1174 12.3718 12.2426 11.2465C13.3679 10.1213 14 8.59521 14 7.00391C14 5.41261 13.3679 3.88648 12.2426 2.76127C11.1174 1.63605 9.5913 1.00391 8 1.00391Z"
              fill="#64748B"
            />
          </svg>
        </slot>
      </div>
    );
  }
}

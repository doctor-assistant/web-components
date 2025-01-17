import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-menu-icon",
  styleUrl: "",
  shadow: true,
})
export class DaaiMenuIcon {
  @Prop() width: string = "20px";
  @Prop() height: string = "20px";
  @Prop() color: string = "#64748B";

  render() {
    return (
      <div class="icon-container">
        <slot>
          <svg
            width="3"
            height="32"
            viewBox="0 0 3 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="1.625" cy="11.25" r="1.375" fill="#93A0B4" />
            <circle cx="1.625" cy="16" r="1.375" fill="#93A0B4" />
            <circle cx="1.625" cy="20.75" r="1.375" fill="#93A0B4" />
          </svg>
        </slot>
      </div>
    );
  }
}

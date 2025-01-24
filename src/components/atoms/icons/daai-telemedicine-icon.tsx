import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "daai-telemedicine-icon",
  styleUrl: "",
  shadow: true,
})
export class DaaiTelemedicineIcon {
  @Prop() width: string = "20px";
  @Prop() height: string = "20px";
  @Prop() color: string = "white";

  render() {
    return (
      <div class="icon-container">
        <slot>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1 14.5V4C1 2.89543 1.89543 2 3 2H21.6125C22.7171 2 23.6125 2.89458 23.6125 3.99915V14.5C23.6125 15.775 22.6 16.7875 21.325 16.7875H15.2875L16.8625 20.4125H19C19.4875 20.4125 19.8625 20.7875 19.8625 21.275C19.8625 21.7625 19.45 22.1375 19 22.1375H5.65C5.1625 22.1375 4.7875 21.7625 4.7875 21.275C4.7875 20.7875 5.2 20.4125 5.65 20.4125H7.7875L9.325 16.7875H3.2875C2.0125 16.7875 1 15.775 1 14.5ZM21.9 14.5728V4.49925C21.9 4.05742 21.5418 3.7 21.1 3.7H3.5C3.05817 3.7 2.7 4.05817 2.7 4.5V14.5728C2.7 14.9256 2.96148 15.2 3.29767 15.2H21.3023C21.6385 15.2 21.9 14.9256 21.9 14.5728ZM9.82495 20.625H15L13.4625 17H11.3625L9.82495 20.625Z"
              fill="white"
            />
          </svg>
        </slot>
      </div>
    );
  }
}

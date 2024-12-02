import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'daai-finish-recording-icon',
  styleUrl: '',
  shadow: true,
})
export class DaaiFinishRecordingsIcon {
  @Prop() width: string = '32px';
  @Prop() height: string = '32px';
  @Prop() color: string = 'white';

  render() {
    return (
      <div class="icon-container">
        <slot>
        <svg width={this.width} height={this.height} viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2240_4766)">
          <path d="M12.2934 3.31246C12.1177 3.13673 11.8443 3.13673 11.6686 3.31246L5.03008 9.75572L1.74987 6.53409C1.57414 6.35836 1.30079 6.37789 1.12507 6.53409C0.949343 6.70981 0.968868 6.98316 1.12507 7.15889L4.581 10.5172C4.69815 10.6343 4.85435 10.6929 5.03008 10.6929C5.2058 10.6929 5.34248 10.6343 5.47915 10.5172L12.2934 3.89821C12.4691 3.76153 12.4691 3.48818 12.2934 3.31246Z" fill={this.color}/>
          </g>
          <defs>
          <clipPath id="clip0_2240_4766">
          <rect width="12.496" height="12.496" fill={this.color} transform="translate(0.461182 0.696289)"/>
          </clipPath>
          </defs>
          </svg>
        </slot>
      </div>
    );
  }
}

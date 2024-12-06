import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'daai-resume-recording-icon',
  styleUrl: '',
  shadow: true,
})
export class DaaiResumeRecordingIcon {
  @Prop() width: string = '16px';
  @Prop() height: string = '16px';
  @Prop() color: string = 'white';

  render() {
    return (
      <div class="icon-container">
        <slot>
        <svg width={this.width} height={this.height} viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.463135 4.42312C0.463135 2.35271 2.14153 0.674316 4.21194 0.674316C6.28235 0.674316 7.96075 2.35271 7.96075 4.42312C7.96075 6.49353 6.28235 8.17193 4.21194 8.17193C2.14153 8.17193 0.463135 6.49353 0.463135 4.42312Z" fill={this.color}/>
        </svg>
        </slot>
      </div>
    );
  }
}

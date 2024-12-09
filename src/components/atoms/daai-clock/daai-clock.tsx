import { Component, h, Host } from '@stencil/core';
import state from '../../../Store/RecorderComponentStore';

@Component({
  tag: 'daai-clock',
  styleUrl: 'daai-clock.css',
  shadow: true,
})
export class DaaiClock {
  timerElement: HTMLElement;
  intervalId: NodeJS.Timer | null = null;

  componentDidLoad() {
    console.log(this.updateTimerStatus())
    this.updateTimerStatus();
  }

  componentDidUpdate() {
    this.updateTimerStatus();
  }

  updateTimerStatus() {
    console.log(state.status)
    if(state.status === 'recording'){
      this.startTimer()
    }
    if(state.status === 'paused'){
      this.pauseTimer()
    }
    if(state.status === 'resume'){
      this.resumeTimer()
    }
    if(state.status === 'finished'){
      this.stopTimer()
    }
  }

  startTimer() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        state.recordingTime++;
        this.timerElement.innerText = this.getFormattedRecordingTime(
          state.recordingTime
        );
      }, 1000);
    }
  }

  pauseTimer() {
    console.log('pausou')
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

 resumeTimer() {
    this.startTimer();
  }

  stopTimer() {
    this.pauseTimer();
    state.recordingTime = 0;
    if (this.timerElement) {
      this.timerElement.innerText = this.getFormattedRecordingTime(0);
    }
  }

  getFormattedRecordingTime(recordingTime: number): string {
    const hours = String(Math.floor(recordingTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((recordingTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(recordingTime % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  render() {
    return (
      <Host>
        <div class="text-sm font-bold">
          <span ref={(el) => (this.timerElement = el as HTMLElement)}>
            {this.getFormattedRecordingTime(0)}
          </span>
        </div>
      </Host>
    );
  }
}

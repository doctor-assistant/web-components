import { Component, h, Host, Prop, State, Watch } from "@stencil/core";
import state from "../../../Store/RecorderComponentStore";

@Component({
  tag: "daai-clock",
  styleUrl: "daai-clock.css",
  shadow: true,
})
export class DaaiClock {
  timerElement: HTMLElement;
  intervalId: NodeJS.Timer | null = null;

  @Prop() status: string = "recording";
  @State() canvasElement!: HTMLCanvasElement;

  @Watch("status")
  handleStatusChange(newValue: string, oldValue: string) {
    const currentStatus = newValue || "recording";

    switch (currentStatus) {
      case "recording":
        this.startTimer();
        break;
      case "paused":
        this.pauseTimer();
        break;
      case "resume":
        this.resumeTimer();
        break;
      case "finished":
        this.stopTimer();
        break;
      default:
        break;
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
    const hours = String(Math.floor(recordingTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((recordingTime % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(recordingTime % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  componentDidLoad() {
    this.handleStatusChange(this.status, "");
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

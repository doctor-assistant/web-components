import { Component, h, Host, Prop, State, Watch, Event, EventEmitter } from "@stencil/core";
import state from "../../../store";

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

  @Event() recordingTimeUpdated: EventEmitter<number>;

  @Watch("status")
  handleStatusChange(newValue: string, _oldValue: string) {
    const currentStatus = newValue || "recording";

    switch (currentStatus) {
      case "recording":
        this.startTimer(true);
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

  startTimer(reset: boolean = false) {
    if (reset) {
      state.recordingTime = 0;
    }
    this.resumeTimer();
  }

  pauseTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resumeTimer() {
    this.pauseTimer();
    this.intervalId = setInterval(() => {
      state.recordingTime++;
      this.recordingTimeUpdated.emit(state.recordingTime);
      if (this.timerElement) {
        this.timerElement.innerText = this.getFormattedRecordingTime(state.recordingTime);
      }
    }, 1000);
  }

  stopTimer() {
    this.pauseTimer();
    state.recordingTime = 0;
    this.recordingTimeUpdated.emit(state.recordingTime);
    if (this.timerElement) {
      this.timerElement.innerText = this.getFormattedRecordingTime(0);
    }
  }

  getFormattedRecordingTime(recordingTime: number): string {
    const minutes = String(Math.floor((recordingTime % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(recordingTime % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  componentDidLoad() {
    this.handleStatusChange(this.status, "");
  }

  disconnectedCallback() {
    this.stopTimer();
  }

  render() {
    return (
      <Host>
        <div class="text-sm font-bold text-slate-500">
          <span ref={(el) => (this.timerElement = el as HTMLElement)}>
            {this.getFormattedRecordingTime(0)}
          </span>
        </div>
      </Host>
    );
  }
}

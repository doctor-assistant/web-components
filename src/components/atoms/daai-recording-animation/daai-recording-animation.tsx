import { Component, Element, h, Prop, State, Watch } from "@stencil/core";

@Component({
  tag: "daai-recording-animation",
  styleUrl: "daai-recording-animation.css",
  shadow: true,
})
export class DaaiRecordingAnimation {
  @Element() el: HTMLElement;

  @Prop() status: string;
  @Prop() animationRecordingColor: string = "#F43F5E";
  @Prop() animationPausedColor: string = "#009CB1";

  @State() canvasElement!: HTMLCanvasElement;

  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  private bufferLength!: number;
  private audioContext!: AudioContext;
  private currentStream: MediaStream | null = null;
  private animationFrameId: number | null = null;

  constructor() {
    this.audioContext = new window.AudioContext();
  }

  disconnectedCallback() {
    // Clean up resources when component is destroyed
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped recording-animation track:', track.kind, track.id);
      });
      this.currentStream = null;
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  @Watch("status")
  async componentDidLoad() {
    await this.initializeAudio();
    await this.startAnimationRecording();
  }

  async initializeAudio() {
    // Store stream reference for cleanup
    this.currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const source = this.audioContext.createMediaStreamSource(this.currentStream);
    this.analyser = this.audioContext.createAnalyser();
    source.connect(this.analyser);
    this.analyser.fftSize = 256;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  startAnimationRecording() {
    if (!this.canvasElement) {
      console.error("Canvas não encontrado!");
      return;
    }

    const ctx = this.canvasElement.getContext("2d");

    const defaultCanvWidth = 120;
    const defaultCanvHeight = 50;
    const lineWidth = 0.5;
    const frequLnum = 50;

    const minBarHeight = 2;

    const centerX = defaultCanvWidth / 2;

    this.canvasElement.width = defaultCanvWidth;
    this.canvasElement.height = defaultCanvHeight;

    const draw = () => {
      if (
        this.status === "recording" ||
        this.status === "resume" ||
        this.status === "micTest" ||
        this.status === "upload"
      ) {
        this.animationFrameId = requestAnimationFrame(draw);

        this.analyser.getByteFrequencyData(this.dataArray);

        ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);

        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, defaultCanvWidth, defaultCanvHeight);

        ctx.strokeStyle = this.animationRecordingColor;
        ctx.lineWidth = lineWidth;

        const h = defaultCanvHeight;

        for (let i = 0; i < frequLnum; i++) {
          const normalizedIndex = (i / (frequLnum - 1)) * 2 - 1;
          const xOffset = normalizedIndex * (defaultCanvWidth / 2);
          const distanceFromCenter = Math.abs(normalizedIndex);
          const intensity = 1 - distanceFromCenter;
          const barHeight = Math.max(
            this.dataArray[i] * intensity,
            minBarHeight
          );
          const space = (h - barHeight) / 2 + 2;

          ctx.beginPath();
          ctx.moveTo(centerX + xOffset, space);
          ctx.lineTo(centerX + xOffset, h - space);
          ctx.stroke();

          if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(centerX - xOffset, space);
            ctx.lineTo(centerX - xOffset, h - space);
            ctx.stroke();
          }
        }
      } else if (this.status === "paused") {
        ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);

        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, defaultCanvWidth, defaultCanvHeight);

        const centerY = defaultCanvHeight / 2;

        ctx.strokeStyle = this.animationPausedColor;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(defaultCanvWidth, centerY);
        ctx.stroke();
      } else {
        // Clean up animation and audio resources when not recording
        if (this.animationFrameId !== null) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
        ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);
        this.canvasElement.width = 0;
        this.canvasElement.height = 0;
      }
    };

    if (this.status === "waiting" || this.status === "finished") {
      this.canvasElement.classList.add("hidden");
    } else {
      this.canvasElement.classList.remove("hidden");
      draw();
    }
  }

  render() {
    return (
      <div>
        <canvas
          ref={(el) => (this.canvasElement = el as HTMLCanvasElement)}
        ></canvas>
      </div>
    );
  }
}

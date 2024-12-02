import { Component, Element, h, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'daai-recording-animation',
  styleUrl: 'daai-recording-animation.css',
  shadow: true,
})
export class DaaiRecordingAnimation {
  @Element() el: HTMLElement;

  @Prop() status: 'recording' | 'paused' | 'waiting' | 'finished' | 'micTest' | 'upload' = 'waiting';
  @Prop() animationRecordingColor: string = '#F43F5E';
  @Prop() animationPausedColor: string = '#009CB1';

  @State() canvasElement!: HTMLCanvasElement;

  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  private bufferLength!: number;
  private audioContext!: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext)();
  }

  @Watch('status')
  statusChanged() {
    this.startAnimationRecording();
  }

  async componentDidLoad() {
    await this.initializeAudio();
    await this.startAnimationRecording();
  }

  async initializeAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    source.connect(this.analyser);
    this.analyser.fftSize = 256;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  async startAnimationRecording() {
    const canvasElement = this.canvasElement;
    if (!canvasElement) {
      console.error('Canvas não encontrado!');
      return;
    }

    const ctx = canvasElement.getContext('2d');
    const defaultCanvWidth = 100;
    const defaultCanvHeight = 50;
    const lineWidth = 0.5;
    const frequLnum = 50;
    const minBarHeight = 2;

    const centerX = defaultCanvWidth / 2;

    canvasElement.width = defaultCanvWidth;
    canvasElement.height = defaultCanvHeight;

    const draw = () => {
      if (this.status === 'recording' || this.status === 'micTest' || this.status === 'upload') {
        requestAnimationFrame(draw);

        this.analyser.getByteFrequencyData(this.dataArray);

        ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);

        const backgroundColor = '#FFF';
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, defaultCanvWidth, defaultCanvHeight);

        ctx.strokeStyle = this.animationRecordingColor;
        ctx.lineWidth = lineWidth;

        const h = defaultCanvHeight;

        for (let i = 0; i < frequLnum; i++) {
          const normalizedIndex = (i / (frequLnum - 1)) * 2 - 1;
          const xOffset = normalizedIndex * (defaultCanvWidth / 2);
          const distanceFromCenter = Math.abs(normalizedIndex);
          const intensity = 1 - distanceFromCenter;
          const barHeight = Math.max(this.dataArray[i] * intensity, minBarHeight);
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
      } else if (this.status === 'paused') {
        requestAnimationFrame(draw);

        ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);

        const backgroundColor = '#FFF';
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, defaultCanvWidth, defaultCanvHeight);

        const dashLineColor = this.animationPausedColor;

        ctx.strokeStyle = dashLineColor;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([3, 2]);

        const centerY = defaultCanvHeight / 2;

        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(defaultCanvWidth, centerY);
        ctx.stroke();

        ctx.setLineDash([]);
      } else {
        canvasElement.width = 0;
        canvasElement.height = 0;
      }
    };

    if (this.status === 'waiting' || this.status === 'finished') {
      canvasElement.classList.add('hidden');
    } else {
      canvasElement.classList.remove('hidden');
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

import { Component, Element, h } from "@stencil/core";

@Component({
  tag: "daai-mic-animation",
  styleUrl: "daai-mic-animation.css",
  shadow: true,
})
export class DaaiMicAnimation {
  @Element() el: HTMLElement;

  private canvasElement!: HTMLCanvasElement;
  private currentStream: MediaStream | null = null;
  private animationFrameId: number | null = null;

  disconnectedCallback() {
    // Clean up resources when component is destroyed
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.currentStream = null;
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  async componentDidLoad() {
    await this.startAnimationMicTest(this.canvasElement);
  }

  async startAnimationMicTest(canvasElement: HTMLCanvasElement) {
    try {
      // Store stream reference for cleanup
      this.currentStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: false,
          autoGainControl: true,
          noiseSuppression: false,
        },
      });

      const audioContext = new window.AudioContext();
      const source = audioContext.createMediaStreamSource(this.currentStream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 4096;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      if (!canvasElement) {
        console.error("Canvas não encontrado!");
        return;
      }

      const canvasCtx = canvasElement.getContext("2d");
      const WIDTH = 80;
      const HEIGHT = 40;

      canvasElement.width = WIDTH;
      canvasElement.height = HEIGHT;

      source.connect(analyser);

      const barWidth = 6;
      const barSpacing = 2;
      const numberOfBars = 6;
      const totalWidth =
        numberOfBars * barWidth + (numberOfBars - 1) * barSpacing;
      const startX = (WIDTH - totalWidth) / 2;

      const barPositions = [];
      for (let i = 0; i < numberOfBars; i++) {
        barPositions.push(startX + i * (barWidth + barSpacing));
      }

      const previousIntensities = new Array(numberOfBars).fill(0);
      const lerp = (a, b, t) => a + (b - a) * t;

      const draw = () => {
        this.animationFrameId = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        barPositions.forEach((x, i) => {
          const barIntensity =
            dataArray[i * Math.floor(bufferLength / numberOfBars)];
          const normalizedIntensity = Math.min(barIntensity / 256, 1);

          previousIntensities[i] = lerp(
            previousIntensities[i],
            normalizedIntensity,
            0.1
          );

          const isActive = previousIntensities[i] > 0.05;

          const color = isActive ? "#637381" : "#DFE4EA";

          const barHeight = HEIGHT / 2;
          const radius = 4; // Bordas arredondadas

          canvasCtx.fillStyle = color;

          canvasCtx.beginPath();
          canvasCtx.moveTo(x + radius, HEIGHT / 2 - barHeight);
          canvasCtx.arcTo(
            x + barWidth,
            HEIGHT / 2 - barHeight,
            x + barWidth,
            HEIGHT / 2,
            radius
          );
          canvasCtx.arcTo(x + barWidth, HEIGHT / 2, x, HEIGHT / 2, radius);
          canvasCtx.arcTo(x, HEIGHT / 2, x, HEIGHT / 2 - barHeight, radius);
          canvasCtx.arcTo(
            x,
            HEIGHT / 2 - barHeight,
            x + radius,
            HEIGHT / 2 - barHeight,
            radius
          );
          canvasCtx.closePath();
          canvasCtx.fill();
        });
      };

      draw();
    } catch (error) {
      console.error("Erro ao capturar o áudio:", error);
    }
  }

  render() {
    return (
      <canvas
        ref={(el) => (this.canvasElement = el as HTMLCanvasElement)}
      ></canvas>
    );
  }
}

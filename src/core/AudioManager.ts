class AudioManager {
  private static instance: AudioManager;
  private context: AudioContext;
  private connections: Map<HTMLVideoElement, {
    source: MediaElementAudioSourceNode;
    gain: GainNode;
  }>;
  private microphoneStream: MediaStream | null = null;
  private videoStream: MediaStream | null = null;

  private constructor() {
    this.context = new AudioContext();
    this.connections = new Map();
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private async connectWithRetry(videoElement: HTMLVideoElement, retries = 3): Promise<MediaStream> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        // Ensure we're disconnected before attempting connection
        this.disconnectVideoElement(videoElement);
        
        // Wait a bit between retries
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const source = this.context.createMediaElementSource(videoElement);
        const gain = this.context.createGain();
        const destination = this.context.createMediaStreamDestination();

        source.connect(gain);
        gain.connect(destination);

        this.connections.set(videoElement, { source, gain });
        this.videoStream = destination.stream;
        return destination.stream;
      } catch (error) {
        console.warn(`Connection attempt ${attempt + 1} failed:`, error);
        
        // On last retry, throw the error
        if (attempt === retries - 1) {
          throw error;
        }
      }
    }
    throw new Error('Failed to connect video element after all retries');
  }

  async connectVideoElement(videoElement: HTMLVideoElement): Promise<MediaStream> {
    try {
      return await this.connectWithRetry(videoElement);
    } catch (error) {
      console.error('Failed to connect video element:', error);
      // Ensure cleanup on failure
      this.disconnectVideoElement(videoElement);
      throw error;
    }
  }

  disconnectVideoElement(videoElement: HTMLVideoElement): void {
    const connection = this.connections.get(videoElement);
    if (connection) {
      try {
        connection.source.disconnect();
        connection.gain.disconnect();
      } catch (error) {
        console.warn('Error disconnecting video element:', error);
      }
      this.connections.delete(videoElement);
    }
  }

  async getMicrophoneStream(constraints: MediaTrackConstraints): Promise<MediaStream> {
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => track.stop());
    }
    this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: constraints });
    return this.microphoneStream;
  }

  createMixedStream(streams: MediaStream[]): MediaStream {
    const mixedStream = new MediaStream();
    streams.forEach(stream => {
      stream.getAudioTracks().forEach(track => mixedStream.addTrack(track));
    });
    return mixedStream;
  }

  cleanup(): void {
    // Clean up all video connections
    this.connections.forEach((_, element) => this.disconnectVideoElement(element));
    this.connections.clear();

    // Stop all streams
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => track.stop());
      this.microphoneStream = null;
    }
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
  }

  async resumeContext(): Promise<void> {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  getContext(): AudioContext {
    return this.context;
  }
}

export default AudioManager;

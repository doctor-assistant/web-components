import { EventSource } from 'extended-eventsource/dist/index.esm.js';

class EventSourceManager {
  public apiKey: string;
  public sseUrl: string;
  public onMessage: (data: any) => void;
  public eventSource: any;
  public retryDelay: number;


  constructor(apiKey, sseUrl, onMessage) {
    console.log(apiKey, sseUrl, onMessage,'apiKey, sseUrl, onMessage')
    this.apiKey = apiKey;
    this.sseUrl = sseUrl;
    this.onMessage = onMessage;
    this.eventSource = null;
    this.retryDelay = 5000;


    this.handleOpen = this.handleOpen.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleError = this.handleError.bind(this);
  }
   async connect() {

    if (this.eventSource) {
      console.warn('EventSource is already connected.');
      return;
    }

    const eventSourceOptions = {
      headers: { 'x-daai-api-key': this.apiKey },
    };
    // const EventSource  = await import('extended-eventsource')
    this.eventSource = new EventSource(this.sseUrl, eventSourceOptions);

    this.eventSource.onopen = this.handleOpen;
    this.eventSource.onmessage = this.handleMessage;
    this.eventSource.onerror = this.handleError;
  }

  handleOpen() {
    console.info('SSE connection opened.');
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      this.onMessage(data);
      if (data.event === 'consultation.integrated') {
        this.close();
      }
    } catch (error) {
      console.error('Error parsing SSE data:', error);
    }
  }

  handleError(error) {
    console.error('SSE connection error:', error);
    this.reconnect();
  }

  reconnect() {
    console.info(`Reconnecting in ${this.retryDelay / 1000} seconds...`);
    setTimeout(() => this.connect(), this.retryDelay);
  }

  close() {
    if (this.eventSource) {
      console.info('Closing SSE connection.');
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export { EventSourceManager };

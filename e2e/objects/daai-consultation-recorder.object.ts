import { E2EPage, newE2EPage } from "@stencil/core/testing";
import { htmlWithVirtualMic } from "../helpers/html.helper";
import { mkdirSync } from 'fs';
import { dirname } from 'path';

export class DaaiConsultationRecorderPageObject {
  page!: E2EPage;
  executionNumber = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];

  constructor(page: E2EPage) {
    this.page = page;
  }

  private static async commonSetup(page: E2EPage) {
    await page.setViewport({
      width: 540,
      height: 68
    });

    await page.setContent('<daai-consultation-recorder></daai-consultation-recorder>');
  }

  static async createEmpty() {
    const page = await newE2EPage();
    await this.commonSetup(page);
    const recorder = new DaaiConsultationRecorderPageObject(page);
    return recorder;
  }

  static async createWithVirtualMic() {
    const html = htmlWithVirtualMic;
    const page = await newE2EPage({
      html,
    });

    await this.commonSetup(page);
    const recorder = new DaaiConsultationRecorderPageObject(page);
    return recorder;
  }

  async setApiKey(apiKey: string) {
    const recorderEl = await this.page.find('daai-consultation-recorder');
    await recorderEl.setProperty('apikey', apiKey);
    await this.page.waitForChanges();
  }

  async setProfessional(professional: string) {
    const recorderEl = await this.page.find('daai-consultation-recorder');
    await recorderEl.setProperty('professional', professional);
    await this.page.waitForChanges();
  }

  async allowMicrophone() {
    await this.page.evaluate(() => {
      return navigator.mediaDevices.getUserMedia({ audio: true });
    });
    await this.page.waitForChanges();
  }

  async rendered() {
    const element = await this.page.find('daai-consultation-recorder');
    expect(element).toHaveClass('hydrated');
  }

  async startRecording() {
    const startButton = await this.page.find('daai-consultation-recorder >>> daai-button-with-icon#start-recording');
    expect(startButton).not.toBeNull();
    await startButton.click();
    await this.page.waitForChanges();

    const preparingText = await this.page.find('daai-consultation-recorder >>> daai-text#preparing p');
    expect(preparingText).not.toBeNull();
    expect(preparingText.innerText).toBe('Preparando...');
    await this.page.waitForChanges();

    const clockElement = await this.page.find('daai-consultation-recorder >>> daai-recording-animation');
    expect(clockElement).not.toBeNull();
    await this.page.waitForChanges();

    // wait for API call
    await this.waitAPICall();
  }

  async waitForRecording(seconds: number) {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  async finishRecording() {
    const finishButton = await this.page.find('daai-consultation-recorder >>> daai-button-with-icon#button-finish');
    expect(finishButton).not.toBeNull();
    expect(finishButton.innerText).toBe('Finalizar Registro');
    finishButton.click();
    await this.page.waitForChanges();

    // wait for API call
    await this.waitAPICall();

    const uploadedText = await this.page.find('daai-consultation-recorder >>> daai-text#upload-text p');
    expect(uploadedText).not.toBeNull();
    expect(uploadedText.innerText).toBe('Registro Finalizado!');
  }

  async restartRecording() {
    const startNewButton = await this.page.find('daai-consultation-recorder >>> daai-button-with-icon#new-recording');
    expect(startNewButton).not.toBeNull();

    await startNewButton.click();
    await this.page.waitForChanges();
  }

  async screenshot(step: string) {
    const path = `screenshots/${this.executionNumber}/${step}.png`;
    mkdirSync(dirname(path), { recursive: true });
    // @ts-ignore
    await this.page.screenshot({ path });
  };

  private async waitAPICall() {
    const API_CALL_WAIT = 5000;
    await new Promise((resolve) => setTimeout(resolve, API_CALL_WAIT))
  };
}
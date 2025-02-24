import { newE2EPage } from '@stencil/core/testing';

describe('daai-consultation-recorder', () => {
  let page;

  beforeAll(async () => {
    page = await newE2EPage();
    await page.setContent('<daai-consultation-recorder></daai-consultation-recorder>');
  });

  describe('Rendering and Hydration', () => {
    it('should render the component with hydrated class', async () => {
      const element = await page.find('daai-consultation-recorder');
      expect(element).toHaveClass('hydrated');
    });
  });

  describe('Start Button', () => {
    it('should render the start button disabled', async () => {
      const startButton = await page.find('daai-consultation-recorder >>> daai-button-with-icon#start-recording-disabled');
      const buttonElement = await startButton.find('button');
      expect(buttonElement).not.toBeNull();
      expect(buttonElement).toHaveAttribute('disabled');
    });
  });

  describe('Specialty Button and Modal', () => {
    it('should render the specialty button enabled', async () => {
      const specialtyButton = await page.find('daai-consultation-recorder >>> daai-button-with-icon#specialty');
      const buttonElement = await specialtyButton.find('button');
      expect(buttonElement).not.toBeNull();
    });

    it('should open and then close the specialty modal on button click', async () => {
      const specialtyButton = await page.find('daai-consultation-recorder >>> daai-button-with-icon#specialty');
      await specialtyButton.click();
      await page.waitForChanges();

      const modal = await page.find('daai-consultation-recorder >>> daai-specialty');
      expect(modal).not.toBeNull();

      // Close the modal
      await page.keyboard.press('Escape');
      await page.waitForChanges();
      const modalClosed = await page.find('daai-consultation-recorder >>> daai-specialty');
      expect(modalClosed).toBeNull();
    });
  });

  describe('Menu Button and Mic Config Modal', () => {
    it('should render the menu button enabled', async () => {
      const menuButton = await page.find('daai-consultation-recorder >>> daai-button-with-icon#button-menu');
      const buttonElement = await menuButton.find('button');
      expect(buttonElement).not.toBeNull();
    });

    it('should open the config modal and then show and close the mic config modal', async () => {
      const menuButton = await page.find('daai-consultation-recorder >>> daai-button-with-icon#button-menu');
      await menuButton.click();
      await page.waitForChanges();

      const configModal = await page.find('daai-consultation-recorder >>> daai-config');
      expect(configModal).not.toBeNull();

      const configButton = await page.find('daai-consultation-recorder >>> daai-button-with-icon#config-mic');
      const configButtonElement = await configButton.find('button');
      expect(configButtonElement).not.toBeNull();

      await configButton.click();
      await page.waitForChanges();

      const micModal = await page.find('daai-consultation-recorder >>> daai-modal');
      expect(micModal).not.toBeNull();

      // Close the mic config modal
      await page.keyboard.press('Escape');
      await page.waitForChanges();
      const micModalClosed = await page.find('daai-consultation-recorder >>> daai-modal');
      expect(micModalClosed).toBeNull();
    });

    it('should open tutorial page on support button click', async () => {
      const menuButton = await page.find('daai-consultation-recorder >>> daai-button-with-icon#button-menu');
      await menuButton.click();
      await page.waitForChanges();

      const configModal = await page.find('daai-consultation-recorder >>> daai-config');
      expect(configModal).not.toBeNull();

      const supportButton = await page.find('daai-consultation-recorder >>> #button-support');
      expect(supportButton).not.toBeNull();
      expect(supportButton).toHaveAttribute('href');
      expect(supportButton.getAttribute('href')).toBe('https://doctorassistant.ai/tutorial/');
      expect(supportButton).toHaveAttribute('target');
      expect(supportButton.getAttribute('target')).toBe('_blank');
    });
  });
});
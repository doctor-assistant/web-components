import { newE2EPage } from '@stencil/core/testing';

describe('daai-recording-animation', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-recording-animation></daai-recording-animation>');

    const element = await page.find('daai-recording-animation');
    expect(element).toHaveClass('hydrated');
  });
});

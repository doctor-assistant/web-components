import { newE2EPage } from '@stencil/core/testing';

describe('daai-mic-animation', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-mic-animation></daai-mic-animation>');

    const element = await page.find('daai-mic-animation');
    expect(element).toHaveClass('hydrated');
  });
});

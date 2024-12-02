import { newE2EPage } from '@stencil/core/testing';

describe('daai-mic', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-mic></daai-mic>');

    const element = await page.find('daai-mic');
    expect(element).toHaveClass('hydrated');
  });
});

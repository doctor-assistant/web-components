import { newE2EPage } from '@stencil/core/testing';

describe('daai-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-text></daai-text>');

    const element = await page.find('daai-text');
    expect(element).toHaveClass('hydrated');
  });
});

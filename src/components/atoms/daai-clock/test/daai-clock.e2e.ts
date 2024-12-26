import { newE2EPage } from '@stencil/core/testing';

describe('daai-clock', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-clock></daai-clock>');

    const element = await page.find('daai-clock');
    expect(element).toHaveClass('hydrated');
  });
});

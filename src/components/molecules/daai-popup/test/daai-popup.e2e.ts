import { newE2EPage } from '@stencil/core/testing';

describe('daai-popup', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-popup></daai-popup>');

    const element = await page.find('daai-popup');
    expect(element).toHaveClass('hydrated');
  });
});

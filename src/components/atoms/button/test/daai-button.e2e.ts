import { newE2EPage } from '@stencil/core/testing';

describe('daai-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-button></daai-button>');

    const element = await page.find('daai-button');
    expect(element).toHaveClass('hydrated');
  });
});

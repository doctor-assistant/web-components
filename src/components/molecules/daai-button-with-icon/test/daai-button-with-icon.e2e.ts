import { newE2EPage } from '@stencil/core/testing';

describe('daai-button-with-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-button-with-icon></daai-button-with-icon>');

    const element = await page.find('daai-button-with-icon');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('daai-specialty', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-specialty></daai-specialty>');

    const element = await page.find('daai-specialty');
    expect(element).toHaveClass('hydrated');
  });
});

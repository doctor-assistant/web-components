import { newE2EPage } from '@stencil/core/testing';

describe('daai-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-modal></daai-modal>');

    const element = await page.find('daai-modal');
    expect(element).toHaveClass('hydrated');
  });
});

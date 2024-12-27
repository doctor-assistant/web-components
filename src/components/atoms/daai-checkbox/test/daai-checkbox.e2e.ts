import { newE2EPage } from '@stencil/core/testing';

describe('daai-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-checkbox></daai-checkbox>');

    const element = await page.find('daai-checkbox');
    expect(element).toHaveClass('hydrated');
  });
});

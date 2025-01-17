import { newE2EPage } from '@stencil/core/testing';

describe('daai-config', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-config></daai-config>');

    const element = await page.find('daai-config');
    expect(element).toHaveClass('hydrated');
  });
});

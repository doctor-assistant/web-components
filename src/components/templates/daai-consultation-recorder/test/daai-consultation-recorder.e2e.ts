import { newE2EPage } from '@stencil/core/testing';

describe('daai-consultation-recorder', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-consultation-recorder></daai-consultation-recorder>');

    const element = await page.find('daai-consultation-recorder');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('daai-consultation-actions', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<daai-consultation-actions></daai-consultation-actions>');

    const element = await page.find('daai-consultation-actions');
    expect(element).toHaveClass('hydrated');
  });
});

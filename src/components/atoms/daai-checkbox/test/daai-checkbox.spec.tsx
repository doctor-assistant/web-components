import { newSpecPage } from '@stencil/core/testing';
import { DaaiCheckbox } from '../daai-checkbox';

describe('daai-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiCheckbox],
      html: `<daai-checkbox></daai-checkbox>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-checkbox>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-checkbox>
    `);
  });
});

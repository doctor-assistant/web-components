import { newSpecPage } from '@stencil/core/testing';
import { DaaiText } from '../daai-text';

describe('daai-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiText],
      html: `<daai-text></daai-text>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-text>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-text>
    `);
  });
});

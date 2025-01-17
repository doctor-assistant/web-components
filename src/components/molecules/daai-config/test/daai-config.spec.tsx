import { newSpecPage } from '@stencil/core/testing';
import { DaaiConfig } from '../daai-config';

describe('daai-config', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiConfig],
      html: `<daai-config></daai-config>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-config>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-config>
    `);
  });
});

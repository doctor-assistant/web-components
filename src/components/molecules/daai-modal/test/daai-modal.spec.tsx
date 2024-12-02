import { newSpecPage } from '@stencil/core/testing';
import { DaaiModal } from '../daai-modal';

describe('daai-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiModal],
      html: `<daai-modal></daai-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-modal>
    `);
  });
});

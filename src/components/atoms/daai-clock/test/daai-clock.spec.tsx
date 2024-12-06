import { newSpecPage } from '@stencil/core/testing';
import { DaaiClock } from '../daai-clock';

describe('daai-clock', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiClock],
      html: `<daai-clock></daai-clock>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-clock>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-clock>
    `);
  });
});

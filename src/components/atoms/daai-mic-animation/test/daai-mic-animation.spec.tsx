import { newSpecPage } from '@stencil/core/testing';
import { DaaiMicAnimation } from '../daai-mic-animation';

describe('daai-mic-animation', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiMicAnimation],
      html: `<daai-mic-animation></daai-mic-animation>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-mic-animation>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-mic-animation>
    `);
  });
});

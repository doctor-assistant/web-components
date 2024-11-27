import { newSpecPage } from '@stencil/core/testing';
import { DaaiButton } from '../daai-button';

describe('daai-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiButton],
      html: `<daai-button></daai-button>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-button>
    `);
  });
});

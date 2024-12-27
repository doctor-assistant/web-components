import { newSpecPage } from '@stencil/core/testing';
import { DaaiPopup } from '../daai-popup';

describe('daai-popup', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiPopup],
      html: `<daai-popup></daai-popup>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-popup>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-popup>
    `);
  });
});

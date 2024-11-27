import { newSpecPage } from '@stencil/core/testing';
import { DaaiButtonWithIcon } from '../daai-button-with-icon';

describe('daai-button-with-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiButtonWithIcon],
      html: `<daai-button-with-icon></daai-button-with-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-button-with-icon>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-button-with-icon>
    `);
  });
});

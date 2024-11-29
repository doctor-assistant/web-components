import { newSpecPage } from '@stencil/core/testing';
import { DaaiButtonWithIcon } from '../daai-button-with-icon';

describe('daai-button-with-icon', () => {
  it('renderiza o daai-button corretamente quando for chamado', async () => {
    const page = await newSpecPage({
      components: [DaaiButtonWithIcon],
      html: `<daai-button-with-icon></daai-button-with-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-button-with-icon>
        <mock:shadow-root>
        <daai-button>
          <slot />
        </daai-button>
        </mock:shadow-root>
      </daai-button-with-icon>
    `);
  });
});

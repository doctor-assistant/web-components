import { newSpecPage } from '@stencil/core/testing';
import { DaaiButtonWithIcon } from '../daai-button-with-icon';

describe('daai-button-with-icon', () => {
  it('renderiza o daai-button-with-icon corretamente quando for chamado', async () => {
    const page = await newSpecPage({
      components: [DaaiButtonWithIcon],
      html: `<daai-button-with-icon></daai-button-with-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-button-with-icon>
        <mock:shadow-root>
          <div class="button-with-icon">
            <slot name="icon"></slot>
            <daai-button>
              <slot></slot>
            </daai-button>
          </div>
        </mock:shadow-root>
      </daai-button-with-icon>
    `);
  });
});

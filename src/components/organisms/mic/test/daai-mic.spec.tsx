import { newSpecPage } from '@stencil/core/testing';
import { DaaiMic } from '../daai-mic';


// fazer esse teste quando for criar esse componente
describe('daai-mic', () => {
  it.skip('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiMic],
      html: `<daai-mic></daai-mic>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-mic>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-mic>
    `);
  });
});

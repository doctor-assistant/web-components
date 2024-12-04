import { newSpecPage } from '@stencil/core/testing';
import { DaaiMic } from '../daai-mic';

describe('daai-mic', () => {
  it('Renderiza corretamente o daai-mic', async () => {
    const page = await newSpecPage({
      components: [DaaiMic],
      html: `<daai-mic></daai-mic>`,
    });

    expect(page.root).toEqualHtml(`
      <daai-mic>
        <div class="flex items-center justify-center bg-white gap-2">
          <daai-logo-icon></daai-logo-icon>
          <div class="flex items-center justify-center">
            <daai-text text="Aguardando autorização do microfone"></daai-text>
          </div>
        </div>
      </daai-mic>
    `);
  });
});

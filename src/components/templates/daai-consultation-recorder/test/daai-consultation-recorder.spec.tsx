import { newSpecPage } from '@stencil/core/testing';
import { DaaiConsultationRecorder } from '../daai-consultation-recorder';

// esse teste vai ser feito quando o componente for totalmente desenvolvido
describe('daai-consultation-recorder', () => {
  it('renderiza corrretamente o daai-consultation-recorder', async () => {
    const page = await newSpecPage({
      components: [DaaiConsultationRecorder],
      html: `<daai-consultation-recorder></daai-consultation-recorder>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-consultation-recorder>
        <mock:shadow-root>
          <slot>
           <div class="bg-white border-4 border-gray-100 flex items-center justify-center p-2 rounded-lg w-96">
             <daai-mic></daai-mic>
           </div>
         </slot>
        </mock:shadow-root>
      </daai-consultation-recorder>
    `);
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { DaaiConsultationRecorder } from '../daai-consultation-recorder';

describe('daai-consultation-recorder', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiConsultationRecorder],
      html: `<daai-consultation-recorder></daai-consultation-recorder>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-consultation-recorder>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-consultation-recorder>
    `);
  });
});

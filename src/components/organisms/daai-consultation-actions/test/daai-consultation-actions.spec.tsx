import { newSpecPage } from '@stencil/core/testing';
import { DaaiConsultationActions } from '../daai-consultation-actions';

describe('daai-consultation-actions', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiConsultationActions],
      html: `<daai-consultation-actions></daai-consultation-actions>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-consultation-actions>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-consultation-actions>
    `);
  });
});

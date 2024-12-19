import { newSpecPage } from '@stencil/core/testing';
import { DaaiSpecialty } from '../daai-specialty';

describe('daai-specialty', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiSpecialty],
      html: `<daai-specialty></daai-specialty>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-specialty>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-specialty>
    `);
  });
});

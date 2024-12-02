import { newSpecPage } from '@stencil/core/testing';
import { DaaiRecordingAnimation } from '../daai-recording-animation';

describe('daai-recording-animation', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DaaiRecordingAnimation],
      html: `<daai-recording-animation></daai-recording-animation>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-recording-animation>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </daai-recording-animation>
    `);
  });
});

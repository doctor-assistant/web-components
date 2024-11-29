import { newSpecPage } from '@stencil/core/testing';
import { DaaiText } from '../daai-text';

describe('daai-text', () => {
  it('deve renderizar texto com a tag padrão (p)', async () => {
    const { root } = await newSpecPage({
      components: [DaaiText],
      html: `<daai-text text="Texto de exemplo"></daai-text>`,
    });
    const shadowElement = root.shadowRoot.querySelector('p');
    expect(shadowElement).not.toBeNull();
    expect(shadowElement.textContent).toBe('Texto de exemplo');
  });

  it('deve renderizar texto com a tag customizada', async () => {
    const { root } = await newSpecPage({
      components: [DaaiText],
      html: `<daai-text text="Texto em h1" tag="h1"></daai-text>`,
    });

    const shadowElement = root.shadowRoot.querySelector('h1');
    expect(shadowElement).not.toBeNull();
    expect(shadowElement.textContent).toBe('Texto em h1');
  });

  it('deve renderizar texto com outra tag customizada', async () => {
    const { root } = await newSpecPage({
      components: [DaaiText],
      html: `<daai-text text="Texto em span" tag="span"></daai-text>`,
    });

    const shadowElement = root.shadowRoot.querySelector('span');
    expect(shadowElement).not.toBeNull();
    expect(shadowElement.textContent).toBe('Texto em span');
  });
});

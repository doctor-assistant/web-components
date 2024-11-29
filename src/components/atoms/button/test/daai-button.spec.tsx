import { newSpecPage } from '@stencil/core/testing';
import { DaaiButton } from '../daai-button';

describe('daai-button', () => {
  it('deve renderizar com a classe customizada', async () => {
    const { root } = await newSpecPage({
      components: [DaaiButton],
      html: `<daai-button customClass="custom-class">Clique aqui</daai-button>`,
    });

    expect(root.shadowRoot.querySelector('button').classList.contains('custom-class')).toBe(true);
  });

  it('deve chamar a função onClick ao ser clicado', async () => {
    const onClickMock = jest.fn();
    const { root } = await newSpecPage({
      components: [DaaiButton],
      html: `<daai-button onClick="${onClickMock}">Clique aqui</daai-button>`,
    });

    const button = root.shadowRoot.querySelector('button');
    button.click();

    expect(onClickMock).toHaveBeenCalled();
  });

  it('deve exibir o conteúdo do slot', async () => {
    const { root } = await newSpecPage({
      components: [DaaiButton],
      html: `<daai-button>Iniciar registro</daai-button>`,
    });
    expect(root.shadowRoot.querySelector('button').textContent).toBe('Iniciar registro');
  });
});

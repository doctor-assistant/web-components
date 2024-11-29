import { Component, Prop, h } from '@stencil/core';

// Defina o tipo das propriedades, incluindo o 'tag' como uma chave válida de tags HTML
@Component({
  tag: 'daai-text',
  styleUrl: 'daai-text.css',
  shadow: true,
})
export class DaaiText {
  // A propriedade 'tag' agora está com o tipo correto
  @Prop() text: string;
  @Prop() tag: keyof HTMLElementTagNameMap = 'p'; // 'p' é o valor padrão

  render() {
    // Usando a tag dinâmica para renderizar o conteúdo
    return (
      <this.tag>
        {this.text}
      </this.tag>
    );
  }
}


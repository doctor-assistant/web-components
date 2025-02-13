# Captura de Áudio de Vídeo

## Descrição
Este documento descreve a funcionalidade de captura de áudio de vídeo no componente web para telemedicina. Esta funcionalidade permite capturar o áudio de um vídeo que está sendo reproduzido na mesma aba onde o componente está sendo renderizado.

## Uso
Para utilizar a captura de áudio de vídeo, você precisa:
1. Ter um elemento de vídeo na página
2. Passar a referência do vídeo para o componente
3. Habilitar o modo telemedicina

```typescript
// HTML
<video id="meu-video" src="video.mp4"></video>

// JavaScript/TypeScript
const videoElement = document.querySelector('#meu-video');

// Componente
<daai-consultation-recorder
  telemedicine={true}
  videoElement={videoElement}
  ...outras props
/>
```

## Comportamento
- Quando `telemedicine={true}` e `videoElement` está presente:
  - O componente captura automaticamente o áudio do vídeo
  - Não solicita ao usuário para escolher aba/janela/tela
  - Mixa o áudio do vídeo com o áudio do microfone

## Fallback
Se ocorrer algum erro na captura do áudio do vídeo ou se `videoElement` não for fornecido:
1. O componente tenta capturar o áudio do vídeo usando Web Audio API
2. Se falhar, volta para o comportamento padrão:
   - Solicita ao usuário para escolher aba/janela/tela
   - Captura o áudio da fonte selecionada
   - Mixa com o áudio do microfone

## Compatibilidade
- Google Chrome (versão 80+)
- Mozilla Firefox (versão 76+)
- Microsoft Edge (versão 80+)
- Safari (versão 13+)

## Limitações
- O elemento de vídeo deve estar na mesma aba do navegador
- O navegador deve suportar Web Audio API
- O usuário deve conceder permissões de acesso ao microfone

# Daai Web Components

### Sumário

1. [Introdução](#introdução)
2. [Como usar o componente](#uso)
3. [Propriedades para o componente](#propriedades)
4. [Uso do componente via CDN](#uso-do-componente-via-cdn)
5. [Eventos](#eventos)
6. [Construção](#construção)

## Introdução

O Daai Web Components é uma biblioteca de componentes web especializados para sistemas de saúde, incluindo o Consultation Recorder para gravação de consultas médicas. Desenvolvido para facilitar a integração em sistemas de saúde, clínicas e plataformas médicas, oferecendo componentes reutilizáveis e personalizáveis.

#### Benefícios

- Componentes especializados para área médica
- Interface intuitiva e personalizável
- Integração fácil com sistemas existentes
- Suporte a diferentes cenários de uso
- Compatibilidade com principais frameworks

## Uso

### Instalação

Para instalar a biblioteca no seu projeto, execute o seguinte comando:

💻 Execute:

```bash
npm i @doctorassistant/web-components
```

### Como usar após a instalação:

Após a instalação, importe e utilize os componentes em seu projeto. Por exemplo, para usar o Consultation Recorder:

```html
import '@doctorassistant/web-components';
<daai-consultation-recorder apiKey="YOUR_API_KEY"></daai-consultation-recorder>
```

## Propriedades

### Propriedades de funcionamento

```js
// ⚠️ A propriedade apiKey é obrigatória
apiKey = 'sua chave de API para autenticação';

// ⚠️ A propriedade professionalId é opcional
professionalId = 'identificador do profissional de saúde';

// ⚠️ A propriedade metadata é opcional
metadata = 'dados adicionais em formato JSON';
```

### Formato metadata

```html
<body>
  <daai-consultation-recorder
    metadata='{"doctorId": "123", "patientId": "456"}'
    apiKey="YOUR_API_KEY"
  >
  </daai-consultation-recorder>
</body>
```

### Customização visual

O componente pode ser personalizado através do objeto theme:

```js
theme: {
  button-start-recording-color,
  button-recording-color,
  button-pause-color,
  button-resume-color,
  button-upload-color,
  border-color,
  animation-recording-color,
  animation-paused-color,
  text-badge-color,
  button-help-color
}
```

### 🖌️ Exemplo de uso da customização:

```html
<daai-consultation-recorder
  apiKey="YOUR_API_KEY"
  theme='{
    "buttonStartRecordingColor": "#0600b1",
    "buttonRecordingColor": "#ff0000",
    "buttonPauseColor": "#ffa500",
    "buttonResumeColor": "#008000",
    "buttonUploadColor": "#0600b1",
    "borderColor": "#0600b1",
    "animationRecordingColor": "#ff0000",
    "animationPausedColor": "#ffa500",
    "textBadgeColor": "#000000",
    "buttonHelpColor": "#0600b1"
  }'
  onSuccess="handleSuccess"
  onError="handleError"
  onEvent="handleEvent"
>
</daai-consultation-recorder>
```

### Callbacks

```js
// Função chamada em caso de sucesso na gravação
onSuccess = (data) => {
  console.log('Gravação finalizada com sucesso:', data);
};

// Função chamada em caso de erro
onError = (error) => {
  console.log('Erro durante a gravação:', error);
};

// Função chamada para eventos do componente
onEvent = (event) => {
  console.log('Evento:', event);
};
```

## Uso do componente via CDN

Para utilizar o componente via CDN, adicione o seguinte script ao seu HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <script 
      src="https://cdn.jsdelivr.net/npm/@doctorassistant/web-components@latest/dist/daai-web-components.js" 
      type="module"
    ></script>
  </head>
  <body>
    <daai-consultation-recorder apiKey="YOUR_API_KEY"></daai-consultation-recorder>
  </body>
</html>
```

## Eventos

O componente emite os seguintes eventos que podem ser capturados através do callback onEvent:

```json
{ "event": "recording.started" }
{ "event": "recording.paused" }
{ "event": "recording.resumed" }
{ "event": "recording.stopped" }
{ "event": "recording.uploaded" }
{ "event": "consultation.processing" }
{ "event": "consultation.completed" }
{ "event": "consultation.integrated" }
```

## Construção

### Shadow DOM 👻

Os componentes utilizam Shadow DOM para encapsulamento, garantindo que seus estilos e funcionalidades não interfiram com o resto da aplicação. Isso permite uma integração segura e isolada em qualquer projeto.

### Compatibilidade

Os componentes são construídos utilizando Web Components, sendo compatíveis com os principais frameworks e bibliotecas:

- React
- Angular
- Vue.js
- Vanilla JavaScript

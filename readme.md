# Componentes Doctor Assitant.ai

1. [Introdução](#introdução)
2. [Como usar o componente](#uso)
3. [Propriedades para o componente](#propriedades)
4. [Customização](#customização)
5. [Uso do componente via CDN](#uso-do-componente-via-cdn)
6. [Especialidades](#especialidades)
7. [Eventos](#eventos)
8. [Limite de tempo de registro](#limite-de-tempo-de-registro)
9. [Comparação entre Versões do Componente Doctor Assistant](#comparação-entre-versões-do-componente-doctor-assistant)
10. [Exemplos de integração em diferentes ambientes](#exemplos-de-integração-em-diferentes-ambientes)

## Introdução

Apatir da versão 2.0.0-rc lançamos uma versão nova do componente de registro da consulta, nessa versão ele é equipado com uma nova mecânica de telemedicina e um novo design.

Vamos comparar as propriedades que foram adicionadas e removidas:

<details>
  <summary>Propriedades de funcionamento</summary>
  Novas propriedades da apartir da 2.0.1-rc :
  Nessa versão retiramos o modeApi e agora o professionalId é professional

```js
// ⚠️ A propriedade professional é obrigatória, sem ela o componente não irá iniciar o registro.
professional =
  "aqui você deve passar um identificador único do usuário que irá utilizar o componente";
// A propriedade telemedicine não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para ativar a funcionalidade de telemedicina no componente.
telemedicine =
  "aqui você deve passar um valor booleano de true caso queira usar a funcionalidade de telemedicina do componente";

// A propriedade hide-tutorial não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para destivar o modal de tutorial da telemedicina.

hide-tutorial =
"Aqui você deve passar um valor booleano  de true para não mostar o popup de tutorial da telemedicina"

// A propriedade max-recording-time não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para limitar o tempo do gravação.
max-recording-time =
"aqui você deve passar um valor em segundos do tempo total que voccê quer que dure a gravação"

// A propriedade warning-recording-time não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para determina em quantos segundos antes do limite você deseja receber um aviso.
warning-recording-time=
"Aqui você determina em quantos segundos antes do limite você deseja receber um aviso"
```

</details>

<details>
  <summary>Propriedades de estilização</summary>
Na versão anterior do componente que foi até a 1.2.6 a estilização funcionava dessa forma:

```html
theme='{ "icon": "path/to/icon.png", "buttonStartRecordingColor": "#0600b1",
"buttonRecordingColor": "#0600b1", "buttonPauseColor": "#0600b1",
"buttonResumeColor": "#0600b1", "buttonUploadColor":"#0600b1", "borderColor":
"#0600b1", "animationRecordingColor":"#0600b1", "animationPausedColor":
"#0600b1", "textBadgeColor": "#0600b1", "buttonHelpColor":"#0600b1" }'
```

Na versão nova apartir da 2.0.0-rc

</details>
## Daai Components

O Daai Components é uma biblioteca de componentes web especializados para sistemas de saúde, incluindo o Consultation Recorder para gravação de consultas médicas. Desenvolvido para facilitar a integração em sistemas de saúde, clínicas e plataformas médicas, oferecendo componentes reutilizáveis e personalizáveis.

### daai-consultation-recorder

O componente é um sistema de integração para empresas de saúde, como clínicas, sistemas de prontuário eletrônico e empresas que possuem soluções próprias. Seu objetivo é capturar o registro das consultas por meio do áudio entre o profissional de saúde e o paciente via API, entregar os resultados da consulta através da transcrição.

#### Benefícios

- Automatização de processos dentro da empresa
- Registro do áudio e processamento de entrega de acordo com a necessidade específica
- Facilidade de customização de acordo com a interface da empresa (whitelabel)
- Ganho de produtividade: não há necessidade de utilizar vários sistemas em paralelo

## Uso

### instalação

Para instalar o `daai-consultation-recorder` no seu projeto, basta rodar no terminal do projeto que você deseja usar o componente.

💻 Execute:

```bash
npm i @doctorassistant/daai-component@2.0.2-rc
```

### Como usar após a instalação:

Após instalar o pacote no seu projeto, basta adicionar a tag <daai-consultation-recorder> no local onde deseja que o componente seja renderizado:

```html
import '@doctorassistant/daai-component';
<daai-consultation-recorder
  apiKey="YOUR_API_KEY"
  professional="YOUR_PROFESSIONAL_ID"
></daai-consultation-recorder>
```

onde ele for chamado vai ser renderizado nesse modelo:

![readme_component_layout.png](https://raw.githubusercontent.com/doctor-assistant/web-components/main/readme_component_layout.png)

## propriedades

### propriedades de funcionamento

```js
// ⚠️ A propriedade professional é obrigatória, sem ela o componente não irá iniciar o registro.
professional =
  "aqui você deve passar um identificador único do usuário que irá utilizar o componente";

// ⚠️ A propriedade apiKey é obrigatória, sem ela o componente não irá fazer requisições a api,
apikey = "aqui você deve passar a chave da api para realizar as requisições";

// A propriedade specialty não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, caso ela não seja passada o usuário pode selecionar a especialidade desejada no select.
specialty =
  "aqui você deve passar a especialidade que você quer que o usuário use";
// A propriedade metadata não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para enviar dados que você deseja recuperar posteriormente pela nossa API quando a gravação for finalizada, possibilitando a recuperação por meio do webhook.
metadata =
  "aqui você deve passar o valor que deseja recuperar, se atente ao formato, descrevo no tópico abaixo.";

// A propriedade telemedicine não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para ativar a funcionalidade de telemedicina no componente.
telemedicine =
  "aqui você deve passar um valor booleano de true caso queira usar a funcionalidade de telemedicina do componente";

// A propriedade hide-tutorial não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para destivar o modal de tutorial da telemedicina.

hide-tutorial =
"Aqui você deve passar um valor booleano  de true para não mostar o popup de tutorial da telemedicina"

// A propriedade max-recording-time não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para limitar o tempo do gravação.
max-recording-time =
"aqui você deve passar um valor em segundos do tempo total que voccê quer que dure a gravação"

// A propriedade warning-recording-time não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para determina em quantos segundos antes do limite você deseja receber um aviso.
warning-recording-time=
"Aqui você determina em quantos segundos antes do limite você deseja receber um aviso"
```

⚠️ A propriedade ~~modeApi~~ não é mais necessária. A partir da versão 1.2.0, identificamos o ambiente de execução através da apiKey

### Formato metadata

```html
// ⚠️ Essse deve ser o formato
<body>
  <daai-consultation-recorder
    metadata='{"name": "doctor", "role": "Assistant"}'
    apiKey="YOUR_API_KEY"
    professional="YOUR_PROFESSIONAL_ID"
  >
  </daai-consultation-recorder>
</body>
```

## Customização

o componente é customizado por meio de variáveis css, então para você customizar você deve fazer o seguinte exemplo:

### 🖌️ Exemplo de uso da customização:

Na da versão 2.0.2-rc temos a estilização por meio de variáveis css:

```css
daai-consultation-recorder {
  --recorder-primary-color: red;
  --recorder-secondary-color: gray;
  --recorder-success-color: red;
  --recorder-support-color: red;
  --recorder-disable-color: red;
  --recorder-error-color: red;
  --recorder-transparent-color: red;
  --recorder-background-color: red;
  --recorder-border-color: red;
  --recorder-button-radius: 1px;
  --recorder-border-radius: 1px;
  --recorder-text-color: yellow;
  --recorder-border-button-color: red;
  --recorder-animation-recording-color: green;
  --recorder-animation-paused-color: green;
  --recorder-tutorial-image: "image_url";
  --recorder-daai-logo-icon: "image_url";
  --recorder-large-device-max-width: 100%;
  --recorder-large-device-min-width: 100%;
  --recorder-small-device-max-width: 500px;
  --recorder-small-device-min-width: 300px;
  --recorder-large-device-height: 52px;
  --recorder-small-device-height: 120px;
}
```

### Callbacks

```js
// Função chamada em caso de sucesso na gravação
onSuccess = (data) => {
  console.log("Gravação finalizada com sucesso:", data);
};

// Função chamada em caso de erro
onError = (error) => {
  console.log("Erro durante a gravação:", error);
};

// Função chamada para eventos do componente
onEvent = (event) => {
  console.log("Evento:", event);
};

// Função chamada quando o tempo restante de gravação atingir o valor definido em warning-recording-time.
onWarningRecordingTime = () => {
  console.log("Essa função vai ser chamada quando faltar 5 segundos");
};
```

## Uso do componente via CDN

Para utilizar o componente via CDN, adicione o seguinte script ao seu HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@2.0.2-rc/dist/web-components/web-components.esm.js"
      type="module"
    ></script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const recorder = document.getElementById("recorder");

        recorder.onSuccess = (event) => {
          console.log("Recording succeeded!", event);
        };

        recorder.onError = (error) => {
          console.error("An error occurred during recording.", error);
        };

        recorder.onEvent = (event) => {
          console.log("An event occurred:", event);
        };
      });
    </script>
  </head>
  <body>
    <daai-consultation-recorder
      id="recorder"
      apiKey="YOUR_API_KEY"
      professional="YOUR_IDENTIFICATOR"
    ></daai-consultation-recorder>
  </body>
</html>
```

## Especialidades

A propriedade `specialty` permite definir a especialidade desejada no componente, definindo o modelo em que o registro será gerado. Quando essa propriedade é fornecida, o seletor de especialidade será desabilitado, garantindo que todos os usuários utilizem a mesma especialidade.

### Especialidades disponíveis:

```js
cardiology: "Cardiologia",
case_discussion: "Discussão de Caso",
dermatology: "Dermatologia",
generic: "SOAP Generalista",
psychiatry: "Psiquiatria",
oncology: "Oncologia",
pediatry: "Pediatria",
pre_natal: "Pré-natal",
geriatry: "Geriatria",
gynecology: "Ginecologia",
neurology: "Neurologia",
rheumatology: "Reumatologia",
family: "Medicina de Família",
emergency: "Medicina de Emergência",
endocrinology: "Endocrinologia",
ophthalmology: "Oftalmologia",
occupational: "Saúde Ocupacional",
psychology: "Psicologia",
general_surgery: "Cirurgia Geral",
plastic_surgery: "Cirurgia Plástica",
nephrology: "Nefrologia",
orthopedic: "Ortopedia",
otorhinolaryngology: "Otorrinolaringologia",
nursing: "Enfermagem",
anesthesiology: "Anestesiologia"
```

🔎 consulte aqui para versões mais atualizada das [especialidades](https://docs.doctorassistant.ai/daai-api-resources/components/processing-a-consultation)

### ⚠️ O que deve ser passado para essa propriedade?

Você deve fornecer o valor em inglês conforme indicado acima. A versão exibida para o usuário será traduzida e formatada automaticamente.

exemplo:
caso você queira setar a especialidade como `Psiquiatria`

```html
<daai-consultation-recorder specialty="psychiatry"></daai-consultation-recorder>
```

⚠️ importante!

- essa propriedade não é obrigatória, caso você não passe o usuário poderá escolher no select a especialidade desejada, caso isso não aconteça o valor default é genérico.
- sempre verifique se o nome da especialidade está correto, caso esteja com erro de digitação o registro será gerado como genérico.

## eventos

Eventos de processamento em tempo real disponíveis que serão recebidos pelo `onEvent`

```json
{ "event": "consultation.processing" }
```

```json
{ "event": "consultation.completed" }
```

```json
{ "event": "consultation.integrated" }
```

## Limite de tempo de registro

A partir da versão 2.0.2-rc, foram adicionados novos mecanismos que permitem limitar o tempo de gravação da consulta.

## Propriedades

### max-recording-time:

Define o tempo máximo de gravação, em segundos.

### warning-recording-time:

Determina em quantos segundos antes do limite você deseja receber um aviso.

### onWarningRecordingTime

Função acionada quando o tempo restante de gravação atingir o valor definido em warning-recording-time.

### exemplo:

Quero que o registro tenha um limite de 20 segundos, quero que o componente me avise quando faltar 5 segundos, então vamos definir assim:

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@2.0.2-rc/dist/web-components/web-components.esm.js"
      type="module"
    ></script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const recorder = document.getElementById("recorder");
        recorder.onWarningRecordingTime = () => {
          console.log("Essa função vai ser chamada quando faltar 5 segundos");
        };
      });
    </script>
  </head>
  <body>
    <daai-consultation-recorder
      id="recorder"
      apiKey="YOUR_API_KEY"
      professional="YOUR_IDENTIFICATOR"
      warning-recording-time="5"
      max-recording-time="20"
    ></daai-consultation-recorder>
  </body>
</html>
```

## Comparação entre Versões do Componente Doctor Assistant

## 1. Identificação dos Componentes

### Versão Antiga (daai-component)

```html
<daai-component apiKey="YOUR_API_KEY"></daai-component>
```

### Versão Nova (web-components)

```html
<daai-consultation-recorder
  apiKey="YOUR_API_KEY"
  professional="YOUR_PROFESSIONAL_ID"
></daai-consultation-recorder>
```

## 2. Propriedades Obrigatórias

### Versão Antiga

- `apiKey`: Chave de API necessária para realizar requisições

### Versão Nova

- `apiKey`: Chave de API necessária para realizar requisições
- `professional`: Identificador único do profissional (substitui o antigo professionalId)

## 3. Customização

### Versão Antiga

Utilizava um objeto theme com propriedades específicas:

```javascript
theme: {
  icon,
    buttonStartRecordingColor,
    buttonRecordingColor,
    buttonPauseColor,
    buttonResumeColor,
    buttonUploadColor,
    borderColor,
    animationRecordingColor,
    animationPausedColor,
    textBadgeColor,
    buttonHelpColor;
}
```

### Versão Nova

Utiliza variáveis CSS para maior flexibilidade:

```css
daai-consultation-recorder {
  --recorder-primary-color: red;
  --recorder-secondary-color: gray;
  --recorder-success-color: red;
  --recorder-support-color: red;
  --recorder-disable-color: red;
  --recorder-error-color: red;
  --recorder-transparent-color: red;
  --recorder-background-color: red;
  --recorder-border-color: red;
  --recorder-button-radius: 1px;
  --recorder-border-radius: 1px;
  --recorder-text-color: yellow;
  --recorder-border-button-color: red;
  --recorder-animation-recording-color: green;
  --recorder-animation-paused-color: green;
  --recorder-tutorial-image: "image_url";
  --recorder-daai-logo-icon: "image_url";
  --recorder-large-device-max-width: 100%;
  --recorder-large-device-min-width: 100%;
  --recorder-small-device-max-width: 500px;
  --recorder-small-device-min-width: 300px;
  --recorder-large-device-height: 52px;
  --recorder-small-device-height: 120px;
}
```

## 4. Novas Funcionalidades

### Telemedicina

A versão nova adiciona suporte à telemedicina através da propriedade `telemedicine`:

```html
<daai-consultation-recorder
  telemedicine="true"
  ...outras
  propriedades
></daai-consultation-recorder>
```

### Controle de Dimensões

A nova versão oferece maior controle sobre as dimensões do componente através de variáveis CSS específicas para diferentes tamanhos de dispositivo.

## 5. Integração via CDN

### Versão Antiga

```html
<script
  src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@latest/dist/DaaiBadge.js"
  type="module"
></script>
```

### Versão Nova

```html
<script
  src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@x.x.x/dist/web-components/web-components.esm.js"
  type="module"
></script>
```

## 6. Eventos e Callbacks

Os eventos e callbacks antigos permanecem mas na nova versão teremos o uma nova callback:

Antigas

- onSuccess
- onError
- onEvent

Nova Callback

- onWarningRecordingTime

## Exemplos de integração em diferentes ambientes

Nessa seção vou mostrar como funciona a integração em diferentes ambientes:

### Usando diretamente no Html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script
      src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@x.x.x/dist/web-components/web-components.esm.js"
      type="module"
    ></script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const recorder = document.getElementById("recorder");

        recorder.onSuccess = (event) => {
          console.log("Recording succeeded!", event);
        };

        recorder.onError = (error) => {
          console.error("An error occurred during recording.", error);
        };

        recorder.onEvent = (event) => {
          console.log("An event occurred:", event);
        };

        recorder.onWarningRecordingTime = () => {
          console.log("Tempo está acabando");
        };
      });
    </script>
  </head>
  <body>
    <daai-consultation-recorder
      id="recorder"
      apiKey="SUA CHAVE AQUI"
      professional="SEU PROFESSIONAL AQUI"
    ></daai-consultation-recorder>
  </body>
</html>
```

### Integração no React

```js
import "@doctorassistant/daai-component";
import { useEffect, useRef } from "react";

import "./App.css";

function App() {
  const recorderRef = useRef(null);

  useEffect(() => {
    const recorder = document.getElementById("recorder");

    if (recorder) {
      recorder.onSuccess = (response) => {
        console.log("Sucesso na requisição:", response);
      };

      recorder.onError = (error) => {
        console.error("Erro na requisição:", error);
      };

      recorder.onEvent = (event) => {
        console.log("Eventos:", event);
      };

      recorder.onWarningRecordingTime = () => {
        console.log("Tempo finalizando");
      };
    }

    return () => {
      if (recorder) {
        recorder.onSuccess = null;
        recorder.onError = null;
        recorder.onEvent = null;
      }
    };
  }, []);

  return (
    <daai-consultation-recorder
      id="recorder"
      apiKey="SUA CHAVE AQUI"
      professional="SEU PROFESSIONAL AQUI"
    ></daai-consultation-recorder>
  );
}

export default App;
```

## Integração no Vue

```js
<template>
  <div>
    <daai-consultation-recorder
      ref="recorder"
      :apiKey="'SUA CHAVE AQUI'"
      :professional="'SEU PROFESSIONAL AQUI'"
    ></daai-consultation-recorder>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import '@doctorassistant/daai-component';

export default {
  name: 'App',
  setup() {
    const recorder = ref(null);

    onMounted(() => {
      if (recorder.value) {
        recorder.value.onSuccess = (response) => {
          console.log('Sucesso na requisição:', response);
        };

        recorder.value.onError = (error) => {
          console.error('Erro na requisição:', error);
        };

        recorder.value.onEvent = (event) => {
          console.log('Eventos:', event);
        };

        recorder.value.onWarningRecordingTime = () => {
          console.log('Tempo finalizando');
        };
      }
    });

    onBeforeUnmount(() => {
      if (recorder.value) {
        recorder.value.onSuccess = null;
        recorder.value.onError = null;
        recorder.value.onEvent = null;
      }
    });

    return {
      recorder,
    };
  },
};
</script>

<style>
/* Aqui você pode adicionar seu CSS, se necessário */
</style>
```

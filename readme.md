# Componentes Doctor Assitant.ai

1. [Introdução](#introdução)
2. [Como usar o componente](#uso)
3. [Propriedades para o componente](#propriedades)
4. [Customização](#customização)
5. [Uso do componente via CDN](#uso-do-componente-via-cdn)
6. [Especialidades](#especialidades)
7. [Eventos](#eventos)
8. [Limite de tempo de registro](#limite-de-tempo-de-registro)
9. [Exemplos de integração em diferentes stacks](#exemplos-de-integração-em-diferentes-stacks)

## Introdução

Apatir da versão 2.0.0-rc lançamos uma versão nova do componente de registro da consulta, nessa versão ele é equipado com uma nova mecânica de telemedicina e um novo design.

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

no x.x.x substitua pela versão vigente do pacote.

```bash
npm i @doctorassistant/daai-component@x.x.x
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
// ⚠️ A propriedade "professional" é obrigatória. Sem ela, o componente não iniciará o registro.
professional = "Identificador único do usuário que utilizará o componente.";

// ⚠️ A propriedade "apiKey" é obrigatória. Sem ela, o componente não fará requisições à API.
apiKey = "Chave da API para realizar as requisições.";

// A propriedade "specialty" não é obrigatória. Caso não seja informada, o usuário poderá selecionar a especialidade desejada no select.
specialty = "Especialidade que o usuário deverá utilizar.";

// A propriedade "metadata" não é obrigatória. Serve para armazenar dados que poderão ser recuperados posteriormente via webhook.
metadata =
  "Valor que deseja recuperar posteriormente, conforme o formato descrito abaixo.";

// A propriedade "telemedicine" não é obrigatória. Caso seja definida como `true`, ativará a funcionalidade de telemedicina no componente.
telemedicine = true; // Defina como `true` para ativar a telemedicina.

// A propriedade "hideTutorial" não é obrigatória. Caso seja definida como `true`, desativará o modal de tutorial da telemedicina.
hideTutorial = true; // Defina como `true` para ocultar o tutorial.

// A propriedade "maxRecordingTime" não é obrigatória. Caso seja informada, define o tempo máximo de gravação (em segundos).
maxRecordingTime = 300; // Exemplo: 300 segundos (5 minutos).

// A propriedade "warningRecordingTime" não é obrigatória. Define em quantos segundos antes do limite o usuário receberá um aviso.
warningRecordingTime = 30; // Exemplo: Aviso 30 segundos antes do fim da gravação
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

Na nova versão temos a estilização por meio de variáveis css:

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
  --recorder-gap: 4px;
  --recorder-padding: 8px;
  --recorder-align: center;
  --recorder-justify-large-size: space-between;
  --recorder-justify-small-size: center;
  --recorder-large-devices-direction: row;
  --recorder-small-devices-direction: column;
}
```

### Callbacks

```js
// Função chamada ao iniciar o registro
onStart = (data) => {
  console.log("Inicio da sua gravação", data);
};
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

no x.x.x substitua pela versão vigente do pacote.

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@x.x.x/dist/web-components/web-components.esm.js"
      type="module"
    ></script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const recorder = document.getElementById("recorder");

        recorder.onStart = (data) => {
          console.log("registration has started", data);
        };

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

no x.x.x substitua pela versão vigente do pacote.

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@x.x.x/dist/web-components/web-components.esm.js"
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

## Exemplos de integração em diferentes stacks

Nessa seção vou mostrar como funciona a integração em diferentes stacks:

### Usando diretamente no Html

no x.x.x substitua pela versão vigente do pacote.

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

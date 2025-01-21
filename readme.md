# Componentes Doctor Assitant.ai

1. [Introdução](#introdução)
2. [Como usar o componente](#uso)
3. [Propriedades para o componente](#propriedades)
4. [Customização](#customização)
5. [Uso do componente via CDN](#uso-do-componente-via-cdn)
6. [Especialidades](#especialidades)
7. [Eventos](#eventos)
8. [Construção do componente](#construção)

## Introdução

### Daai-consultation-recorder

O componente é um sistema de integração para empresas de saúde, como clínicas, sistemas de prontuário eletrônico e empresas que possuem soluções próprias. Seu objetivo é capturar o registro das consultas por meio do áudio entre o profissional de saúde e o paciente via API, entregar os resultados da consulta através da transcrição.

#### Benefícios

- Automatização de processos dentro da empresa
- Registro do áudio e processamento de entrega de acordo com a necessidade específica
- Facilidade de customização de acordo com a interface da empresa (whitelabel)
- Ganho de produtividade: não há necessidade de utilizar vários sistemas em paralelo

## Uso

### instalação

Para instalar o `Daai-consultation-recorder` no seu projeto, basta rodar no terminal do projeto que você deseja usar o componente.

💻 Execute esse comando:

```bash
npm i @doctorassistant/daai-component
```

### Como usar após a instalação:

Após instalar o pacote no seu projeto, basta adicionar a tag <daai-consultation-recorder> no local onde deseja que o componente seja renderizado:

```html
import '@doctorassistant/daai-component';
<daai-consultation-recorder apiKey="YOUR_API_KEY"></daai-consultation-recorder>
```

onde ele for chamado vai ser renderizado nesse modelo:

![readme_component_layout.png](https://raw.githubusercontent.com/doctor-assistant/daai-component/main/readme_component_layout.png)

## propriedades

### propriedades de funcionamento

```js
// ⚠️ A propriedade professional não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, mas é importante que você passe o indentificador para que a especialidade seja atrealada ao professional e
professional =
  "aqui você deve passar um identificador para o usuário que irá utilizar a componente";

// ⚠️ A propriedade apiKey é obrigatória, sem ela o componente não irá fazer requisições a api
apikey = "aqui você deve passar a chave da api para realizar as requisições";

// ⚠️ A propriedade specialty não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, caso ela não seja passada o usuário pode selecionar a especialidade desejada no select.
specialty =
  "aqui você deve passar a especialidade que você quer que o usuário use";
// ⚠️ A propriedade metadata não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave, no entanto, a chave serve para enviar dados que você deseja recuperar posteriormente pela nossa API quando a gravação for finalizada, possibilitando a recuperação por meio do webhook.
metadata =
  "aqui você deve passar o valor que deseja recuperar, se atente ao formato, descrevo no tópico abaixo.";
```

⚠️ A propriedade ~~modeApi~~ não é mais necessária. A partir da versão 1.2.0, identificamos o ambiente de execução através da apiKey

### Formato metadata

```html
// ⚠️ Essse deve ser o formato
<body>
  <daai-consultation-recorder
    metadata='{"name": "doctor", "role": "Assistant"}'
    apiKey="YOUR_API_KEY"
  >
  </daai-consultation-recorder>
</body>
```

## Customização

o componente é customizado por meio de variáveis css, então para você customizar você deve fazer o seguinte exemplo:

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
  --recorder-tutorial-image: "image_url";
}
```

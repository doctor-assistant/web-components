# Comparação entre Versões do Componente Doctor Assistant

Este documento apresenta as principais diferenças entre a versão antiga (daai-component) e a nova versão (web-components) do componente de gravação de consultas.

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

## 2. Instalação

### Versão Antiga
```bash
npm i @doctorassistant/daai-component
```

### Versão Nova
```bash
npm i @doctorassistant/daai-component@2.0.1-rc
```

## 3. Propriedades Obrigatórias

### Versão Antiga
- `apiKey`: Chave de API necessária para realizar requisições

### Versão Nova
- `apiKey`: Chave de API necessária para realizar requisições
- `professional`: Identificador único do profissional (substitui o antigo professionalId)

## 4. Customização

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
  buttonHelpColor
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

## 5. Novas Funcionalidades

### Telemedicina
A versão nova adiciona suporte à telemedicina através da propriedade `telemedicine`:
```html
<daai-consultation-recorder
  telemedicine="true"
  ...outras propriedades
></daai-consultation-recorder>
```

### Controle de Dimensões
A nova versão oferece maior controle sobre as dimensões do componente através de variáveis CSS específicas para diferentes tamanhos de dispositivo.

## 6. Novas Especialidades

A nova versão inclui mais especialidades médicas:
- Psicologia (psychology)
- Cirurgia Geral (general_surgery)
- Cirurgia Plástica (plastic_surgery)
- Nefrologia (nephrology)
- Ortopedia (orthopedic)
- Otorrinolaringologia (otorhinolaryngology)
- Enfermagem (nursing)
- Anestesiologia (anesthesiology)

## 7. Integração via CDN

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
  src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@2.0.1-rc/dist/web-components/web-components.esm.js"
  type="module"
></script>
```

## 8. Eventos e Callbacks

Os eventos e callbacks permanecem consistentes entre as versões, mantendo:
- onSuccess
- onError
- onEvent

## 9. Conclusão

A nova versão (web-components) apresenta melhorias significativas em relação à versão anterior:
- Arquitetura mais modular e organizada
- Maior flexibilidade na customização através de variáveis CSS
- Suporte expandido para especialidades médicas
- Adição de funcionalidades como telemedicina
- Melhor controle sobre dimensões e responsividade
- Nomenclatura mais descritiva e intuitiva

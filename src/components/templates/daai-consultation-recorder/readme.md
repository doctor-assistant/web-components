# daai-consultation-recorder



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                | Description | Type                                           | Default                 |
| ------------------------ | ------------------------ | ----------- | ---------------------------------------------- | ----------------------- |
| `apikey`                 | `apikey`                 |             | `string`                                       | `undefined`             |
| `hideTutorial`           | `hide-tutorial`          |             | `boolean`                                      | `false`                 |
| `maxRecordingTime`       | `max-recording-time`     |             | `number`                                       | `Infinity`              |
| `metadata`               | `metadata`               |             | `string`                                       | `undefined`             |
| `onError`                | --                       |             | `(err: Error) => void`                         | `undefined`             |
| `onEvent`                | --                       |             | `(response: Response) => void`                 | `undefined`             |
| `onStart`                | --                       |             | `(consultation: ConsultationResponse) => void` | `undefined`             |
| `onSuccess`              | --                       |             | `(consultation: ConsultationResponse) => void` | `undefined`             |
| `onWarningRecordingTime` | --                       |             | `() => void`                                   | `undefined`             |
| `professional`           | `professional`           |             | `string`                                       | `undefined`             |
| `specialty`              | `specialty`              |             | `string`                                       | `state.chooseSpecialty` |
| `telemedicine`           | `telemedicine`           |             | `boolean`                                      | `undefined`             |
| `videoElement`           | --                       |             | `HTMLVideoElement`                             | `undefined`             |
| `warningRecordingTime`   | `warning-recording-time` |             | `number`                                       | `0`                     |


## Dependencies

### Depends on

- [daai-mic](../../organisms/mic)
- [daai-clock](../../atoms/daai-clock)
- [daai-consultation-actions](../../organisms/daai-consultation-actions)
- [daai-modal](../../molecules/daai-modal)
- [daai-popup](../../molecules/daai-popup)
- [daai-specialty](../../molecules/daai-specialty)

### Graph
```mermaid
graph TD;
  daai-consultation-recorder --> daai-mic
  daai-consultation-recorder --> daai-clock
  daai-consultation-recorder --> daai-consultation-actions
  daai-consultation-recorder --> daai-modal
  daai-consultation-recorder --> daai-popup
  daai-consultation-recorder --> daai-specialty
  daai-mic --> daai-text
  daai-mic --> daai-recording-animation
  daai-consultation-actions --> daai-button-with-icon
  daai-consultation-actions --> daai-mic-icon
  daai-consultation-actions --> daai-text
  daai-consultation-actions --> daai-menu-icon
  daai-consultation-actions --> daai-config
  daai-consultation-actions --> daai-resume-recording-icon
  daai-consultation-actions --> daai-pause-icon
  daai-button-with-icon --> daai-button
  daai-config --> daai-button-with-icon
  daai-config --> daai-config-mic-icon
  daai-config --> daai-text
  daai-config --> daai-menu-tutorial-icon
  daai-modal --> daai-button
  daai-popup --> daai-text
  daai-popup --> daai-checkbox
  daai-specialty --> daai-button
  style daai-consultation-recorder fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

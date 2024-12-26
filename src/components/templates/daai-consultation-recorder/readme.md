# daai-consultation-recorder



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type                           | Default                 |
| -------------- | -------------- | ----------- | ------------------------------ | ----------------------- |
| `apikey`       | `apikey`       |             | `string`                       | `undefined`             |
| `metadata`     | `metadata`     |             | `string`                       | `undefined`             |
| `onError`      | --             |             | `(err: Error) => void`         | `undefined`             |
| `onSuccess`    | --             |             | `(response: Response) => void` | `undefined`             |
| `specialty`    | `specialty`    |             | `string`                       | `state.chooseSpecialty` |
| `telemedicine` | `telemedicine` |             | `boolean`                      | `undefined`             |


## Dependencies

### Depends on

- [daai-mic](../../organisms/mic)
- [daai-clock](../../atoms/daai-clock)
- [daai-text](../../atoms/text)
- [daai-consultation-actions](../../organisms/daai-consultation-actions)
- [daai-modal](../../molecules/daai-modal)
- [daai-specialty](../../molecules/daai-specialty)

### Graph
```mermaid
graph TD;
  daai-consultation-recorder --> daai-mic
  daai-consultation-recorder --> daai-clock
  daai-consultation-recorder --> daai-text
  daai-consultation-recorder --> daai-consultation-actions
  daai-consultation-recorder --> daai-modal
  daai-consultation-recorder --> daai-specialty
  daai-mic --> daai-logo-icon
  daai-mic --> daai-text
  daai-mic --> daai-recording-animation
  daai-consultation-actions --> daai-button-with-icon
  daai-consultation-actions --> daai-config-mic-icon
  daai-consultation-actions --> daai-stethoscope-icon
  daai-consultation-actions --> daai-support-icon
  daai-consultation-actions --> daai-resume-recording-icon
  daai-consultation-actions --> daai-pause-icon
  daai-button-with-icon --> daai-button
  daai-modal --> daai-button
  daai-specialty --> daai-button
  style daai-consultation-recorder fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

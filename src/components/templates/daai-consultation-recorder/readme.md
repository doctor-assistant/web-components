# daai-consultation-recorder



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type     | Default     |
| ----------- | ------------ | ----------- | -------- | ----------- |
| `apiKey`    | `api-key`    |             | `string` | `undefined` |
| `metadata`  | `metadata`   |             | `string` | `undefined` |
| `onError`   | `on-error`   |             | `any`    | `undefined` |
| `onSuccess` | `on-success` |             | `any`    | `undefined` |
| `specialty` | `specialty`  |             | `string` | `undefined` |


## Dependencies

### Depends on

- [daai-mic](../../organisms/mic)
- [daai-text](../../atoms/text)
- [daai-clock](../../atoms/daai-clock)
- [daai-consultation-actions](../../organisms/daai-consultation-actions)
- [daai-modal](../../molecules/daai-modal)

### Graph
```mermaid
graph TD;
  daai-consultation-recorder --> daai-mic
  daai-consultation-recorder --> daai-text
  daai-consultation-recorder --> daai-clock
  daai-consultation-recorder --> daai-consultation-actions
  daai-consultation-recorder --> daai-modal
  daai-mic --> daai-logo-icon
  daai-mic --> daai-text
  daai-mic --> daai-mic-animation
  daai-mic --> daai-recording-animation
  daai-mic --> daai-button-with-icon
  daai-mic --> daai-config-mic-icon
  daai-button-with-icon --> daai-button
  daai-consultation-actions --> daai-button-with-icon
  daai-consultation-actions --> daai-stethoscope-icon
  daai-consultation-actions --> daai-mic-icon
  daai-consultation-actions --> daai-support-icon
  daai-consultation-actions --> daai-pause-icon
  daai-consultation-actions --> daai-finish-recording-icon
  daai-consultation-actions --> daai-resume-recording-icon
  daai-modal --> daai-button
  style daai-consultation-recorder fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

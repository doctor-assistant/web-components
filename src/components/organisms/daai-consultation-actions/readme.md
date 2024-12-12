# daai-consultation-actions



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

### Used by

 - [daai-consultation-recorder](../../templates/daai-consultation-recorder)

### Depends on

- [daai-button-with-icon](../../molecules/daai-button-with-icon)
- [daai-stethoscope-icon](../../atoms/icons)
- [daai-mic-icon](../../atoms/icons)
- [daai-support-icon](../../atoms/icons)
- [daai-pause-icon](../../atoms/icons)
- [daai-finish-recording-icon](../../atoms/icons)
- [daai-resume-recording-icon](../../atoms/icons)

### Graph
```mermaid
graph TD;
  daai-consultation-actions --> daai-button-with-icon
  daai-consultation-actions --> daai-stethoscope-icon
  daai-consultation-actions --> daai-mic-icon
  daai-consultation-actions --> daai-support-icon
  daai-consultation-actions --> daai-pause-icon
  daai-consultation-actions --> daai-finish-recording-icon
  daai-consultation-actions --> daai-resume-recording-icon
  daai-button-with-icon --> daai-button
  daai-consultation-recorder --> daai-consultation-actions
  style daai-consultation-actions fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

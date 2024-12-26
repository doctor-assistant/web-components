# daai-consultation-actions



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type      | Default     |
| -------------- | -------------- | ----------- | --------- | ----------- |
| `apikey`       | `apikey`       |             | `any`     | `undefined` |
| `error`        | `error`        |             | `any`     | `undefined` |
| `metadata`     | `metadata`     |             | `string`  | `undefined` |
| `specialty`    | `specialty`    |             | `any`     | `undefined` |
| `success`      | `success`      |             | `any`     | `undefined` |
| `telemedicine` | `telemedicine` |             | `boolean` | `undefined` |


## Dependencies

### Used by

 - [daai-consultation-recorder](../../templates/daai-consultation-recorder)

### Depends on

- [daai-button-with-icon](../../molecules/daai-button-with-icon)
- [daai-config-mic-icon](../../atoms/icons)
- [daai-stethoscope-icon](../../atoms/icons)
- [daai-support-icon](../../atoms/icons)
- [daai-resume-recording-icon](../../atoms/icons)
- [daai-pause-icon](../../atoms/icons)

### Graph
```mermaid
graph TD;
  daai-consultation-actions --> daai-button-with-icon
  daai-consultation-actions --> daai-config-mic-icon
  daai-consultation-actions --> daai-stethoscope-icon
  daai-consultation-actions --> daai-support-icon
  daai-consultation-actions --> daai-resume-recording-icon
  daai-consultation-actions --> daai-pause-icon
  daai-button-with-icon --> daai-button
  daai-consultation-recorder --> daai-consultation-actions
  style daai-consultation-actions fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

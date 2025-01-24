# daai-consultation-actions



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type      | Default     |
| -------------- | -------------- | ----------- | --------- | ----------- |
| `apikey`       | `apikey`       |             | `any`     | `""`        |
| `error`        | `error`        |             | `any`     | `undefined` |
| `event`        | `event`        |             | `any`     | `undefined` |
| `metadata`     | `metadata`     |             | `string`  | `undefined` |
| `professional` | `professional` |             | `string`  | `""`        |
| `specialty`    | `specialty`    |             | `any`     | `undefined` |
| `success`      | `success`      |             | `any`     | `undefined` |
| `telemedicine` | `telemedicine` |             | `boolean` | `undefined` |


## Dependencies

### Used by

 - [daai-consultation-recorder](../../templates/daai-consultation-recorder)

### Depends on

- [daai-button-with-icon](../../molecules/daai-button-with-icon)
- [daai-mic-icon](../../atoms/icons)
- [daai-text](../../atoms/text)
- [daai-menu-icon](../../atoms/icons)
- [daai-config](../../molecules/daai-config)
- [daai-resume-recording-icon](../../atoms/icons)
- [daai-pause-icon](../../atoms/icons)

### Graph
```mermaid
graph TD;
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
  daai-consultation-recorder --> daai-consultation-actions
  style daai-consultation-actions fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

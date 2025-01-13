# daai-mic

<!-- Auto Generated Below -->


## Events

| Event            | Description | Type                                          |
| ---------------- | ----------- | --------------------------------------------- |
| `interfaceEvent` |             | `CustomEvent<{ microphoneSelect: boolean; }>` |


## Dependencies

### Used by

 - [daai-consultation-recorder](../../templates/daai-consultation-recorder)

### Depends on

- [daai-text](../../atoms/text)
- [daai-recording-animation](../../atoms/daai-recording-animation)

### Graph
```mermaid
graph TD;
  daai-mic --> daai-text
  daai-mic --> daai-recording-animation
  daai-consultation-recorder --> daai-mic
  style daai-mic fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

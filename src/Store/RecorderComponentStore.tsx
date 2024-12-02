import { createStore } from "@stencil/store";

const { state } = createStore({
  status: 'recording',
});

export default state;

import { createStore } from "@stencil/store";

const { state } = createStore({
  status: 'initial',
});

export default state;

import { createStore } from "@stencil/store";

const { state } = createStore({
  status: 'initial',
  openModalConfig: false,
  openModalSpecialty: false,
  microphonePermission: false,
  chosenMicrophone:''
});

export default state;

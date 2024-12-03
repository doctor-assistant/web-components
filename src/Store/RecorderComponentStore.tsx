import { createStore } from "@stencil/store";

const { state } = createStore({
  status: 'recording',
  openModalConfig: false,
  openModalSpecialty: false,
  microphonePermission: false,
  availableMicrophones:[],
  defaultMicrophone:''
});

export default state;

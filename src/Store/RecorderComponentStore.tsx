import { createStore } from "@stencil/store";

const { state } = createStore({
  status: 'initial',
  openModalConfig: false,
  openModalSpecialty: false,
  microphonePermission: false,
  availableMicrophones:[],
  defaultMicrophone:'',
  recordingTime:0
});

console.log('status atualizado:', state.status)
export default state;

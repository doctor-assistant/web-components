import { createStore } from "@stencil/store";

const { state } = createStore({
  status: "initial",
  openModalConfig: false,
  openModalSpecialty: false,
  chooseModality: false,
  microphonePermission: false,
  availableMicrophones: [],
  chosenMicrophone: "",
  defaultMicrophone: "",
  recordingTime: 0,
  specialtyList: [],
  chooseSpecialty: "",
});

export default state;

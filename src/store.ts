import { createStore } from "@stencil/store";

const { state } = createStore({
  status: "initial",
  telemedicine: false,
  openModalConfig: false,
  openModalSpecialty: false,
  openTutorialPopup: false,
  openMenu: false,
  isOpenMenuToCancelAnimation: false,
  isChecked: false,
  chooseModality: false,
  microphonePermission: false,
  availableMicrophones: [],
  chosenMicrophone: "",
  defaultMicrophone: "",
  recordingTime: 0,
  specialtyList: [],
  chooseSpecialty: "",
  specialtyTitle: "",
  defaultSpecialty: "",
});

export default state;

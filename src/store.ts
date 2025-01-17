import { createStore } from "@stencil/store";

const { state } = createStore({
  status: "initial",
  telemedicine: false,
  openModalConfig: false,
  openModalSpecialty: false,
  openTutorialPopup: false,
  isChecked: false,
  chooseModality: false,
  microphonePermission: false,
  availableMicrophones: [],
  chosenMicrophone: "",
  defaultMicrophone: "",
  showsScreen: false,
  recordingTime: 0,
  specialtyList: [],
  chooseSpecialty: "",
  specialtyTitle: "",
  defaultSpecialty: "",
  openMenu: false,
});

export default state;

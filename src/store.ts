import { createStore } from "@stencil/store";

const { state, onChange } = createStore({
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
  defaultMicrophone: "",
  recordingTime: 0,
  specialtyList: [],
  chooseSpecialty: "",
  specialtyTitle: "",
  defaultSpecialty: "",
  isProcessingChunk: false,
  reportSchema: undefined,
});

export default state;
export { onChange };

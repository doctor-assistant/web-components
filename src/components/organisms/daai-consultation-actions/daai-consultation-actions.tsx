import { Component, h, Prop, State, Watch } from "@stencil/core";
import {
  finishRecording,
  pauseRecording,
  resumeRecording,
  retryUpload,
  startRecording,
  StartTutorial,
} from "../../../core/Recorder";
import state from "../../../store";
import { getSpecialtiesByProfessionalId } from "../../../utils/indexDb";

@Component({
  tag: "daai-consultation-actions",
  styleUrl: "daai-consultation-actions.css",
  shadow: false,
})
export class DaaiConsultationActions {
  @Prop() apikey: any = "";
  @Prop() specialty: any;
  @Prop() telemedicine: boolean;
  @Prop() videoElement?: HTMLVideoElement;
  @Prop() professional: string = "";

  @Prop() success: any;
  @Prop() error: any;
  @Prop() metadata: string;
  @Prop() event: any;
  @Prop() mode: string;

  @State() title: string = "";
  @State() stopAnimation: string = "";

  @Prop() recordingTime: number = 0;
  @Prop() recordingConfig: {
    onWarningRecordingTime: () => void;
    maxRecordingTime: number;
    warningRecordingTime: number;
  };

  @Prop() hideTutorial: boolean = false;

  newRecording() {
    state.status = "initial";
  }

  async choosenMode() {
    if (this.telemedicine) {
      state.status = "choosen";
    } else {
      state.status = "recording";
    }
  }

  choosenSpecialty() {
    state.openModalSpecialty = true;
  }

  async componentDidLoad() {
    const specialtyByProfessionalId = await getSpecialtiesByProfessionalId(
      this.professional
    );
    if (
      specialtyByProfessionalId.mostRecentSpecialty &&
      specialtyByProfessionalId.specialtiesAsStrings
    ) {
      state.specialtyTitle =
        specialtyByProfessionalId.mostRecentSpecialty.title;
      state.chooseSpecialty = specialtyByProfessionalId.mostRecentSpecialty.id;
    }

    const storedValue = localStorage.getItem("checkboxState");
    state.isChecked = storedValue !== null ? JSON.parse(storedValue) : "";
    this.title = `Especialidade`;
  }

  @Watch("recordingTime")
  handleRecordingTimeChange() {
    if (!this.recordingConfig) return;
    const { maxRecordingTime, warningRecordingTime, onWarningRecordingTime } =
      this.recordingConfig;
    const emitWarning =
      maxRecordingTime - this.recordingTime == warningRecordingTime &&
      onWarningRecordingTime;

    if (emitWarning) {
      onWarningRecordingTime();
    }

    if (this.recordingTime >= maxRecordingTime) {
      finishRecording({
        mode: this.mode,
        apikey: this.apikey,
        success: this.success,
        error: this.error,
        specialty: this.specialty,
        metadata: this.metadata,
        onEvent: this.event,
        professional: this.professional,
      });
    }
  }

  openConfigModal() {
    state.openMenu = true;
    state.isOpenMenuToCancelAnimation = true;
    localStorage.setItem(
      "isOpenMenuToCancelAnimation",
      JSON.stringify(state.isOpenMenuToCancelAnimation)
    );
  }

  readyToUse = state.microphonePermission && this.professional && this.apikey;

  renderButtons() {
    switch (state.status) {
      case "initial":
        return (
          <div class="flex items-center justify-center">
            <div class="flex items-center justify-center gap-x-2">
              {!state.defaultSpecialty && (
                <daai-button-with-icon
                  title={this.title}
                  id="specialty"
                  onClick={this.choosenSpecialty}
                  disabled={state.defaultSpecialty !== ""}
                >
                  {state.specialtyTitle
                    ? state.specialtyTitle
                    : "SOAP Generalista"}
                </daai-button-with-icon>
              )}
              <daai-button-with-icon
                id={
                  this.professional && this.apikey && state.microphonePermission
                    ? "start-recording"
                    : "start-recording-disabled"
                }
                onClick={() => {
                  if (
                    this.professional &&
                    this.apikey &&
                    state.microphonePermission
                  ) {
                    this.telemedicine
                      ? this.choosenMode()
                      : startRecording(false);
                  }
                }}
                disabled={
                  !state.microphonePermission ||
                  !this.apikey ||
                  !this.professional
                }
              >
                <div class="flex items-center justify-start gap-2">
                  <daai-mic-icon></daai-mic-icon>
                  <daai-text text="Iniciar Registro"></daai-text>
                </div>
              </daai-button-with-icon>
              <daai-button-with-icon
                id="button-menu"
                onClick={this.openConfigModal}
              >
                <daai-menu-icon />
              </daai-button-with-icon>
            </div>
            {state.openMenu && <daai-config />}
          </div>
        );
      case "choosen":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              id="choose-local-consultation"
              onClick={() => startRecording(false)}
            >
              <div class="flex items-center justify-center p-2">Presencial</div>
            </daai-button-with-icon>
            <daai-button-with-icon
              id="choose-telemedicine-consultation"
              onClick={() =>
                state.isChecked || this.hideTutorial
                  ? startRecording(true, this.videoElement)
                  : StartTutorial()
              }
            >
              Telemedicina
            </daai-button-with-icon>
            <daai-button-with-icon
              id="button-resume"
              onClick={() => this.newRecording()}
            >
              <daai-resume-recording-icon />
            </daai-button-with-icon>
          </div>
        );
      case "recording":
      case "resume":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              id="pause-recording"
              onClick={() => pauseRecording()}
            >
              <daai-pause-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              id="button-finish"
              onClick={() =>
                finishRecording({
                  mode: this.mode,
                  apikey: this.apikey,
                  success: this.success,
                  error: this.error,
                  specialty: this.specialty,
                  metadata: this.metadata,
                  onEvent: this.event,
                  professional: this.professional,
                })
              }
            >
              Finalizar Registro
            </daai-button-with-icon>
          </div>
        );
      case "paused":
        return (
          <div
            class="flex items-center justify-center gap-2
          "
          >
            <daai-button-with-icon id="pause-recording-disabled" disabled>
              <daai-pause-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              id="start-recording"
              onClick={() => resumeRecording()}
            >
              <div class="flex items-start justify-start gap-2">
                <daai-mic-icon></daai-mic-icon>
                <daai-text text="Retomar"></daai-text>
              </div>
            </daai-button-with-icon>
            <daai-button-with-icon
              id="button-finish"
              onClick={() =>
                finishRecording({
                  mode: this.mode,
                  apikey: this.apikey,
                  success: this.success,
                  error: this.error,
                  specialty: this.specialty,
                  metadata: this.metadata,
                  onEvent: this.event,
                  professional: this.professional,
                })
              }
            >
              Finalizar Registro
            </daai-button-with-icon>
          </div>
        );
      case "upload-ok":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              id="new-recording"
              onClick={() => this.newRecording()}
            >
              Novo Registro
            </daai-button-with-icon>
          </div>
        );
      case "upload-error":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              id="new-recording"
              onClick={() =>
                retryUpload(
                  this.mode,
                  this.apikey,
                  this.professional,
                  this.success,
                  this.error,
                  this.event,
                  true
                )
              }
            >
              Tentar Novamente
            </daai-button-with-icon>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    return <div>{this.renderButtons()}</div>;
  }
}

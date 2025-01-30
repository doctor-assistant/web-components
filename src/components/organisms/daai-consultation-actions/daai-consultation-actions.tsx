import { Component, h, Prop, State } from "@stencil/core";
import {
  finishRecording,
  pauseRecording,
  resumeRecording,
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
  @Prop() professional: string = "";

  @Prop() success: any;
  @Prop() error: any;
  @Prop() metadata: string;
  @Prop() event: any;
  @Prop() duration: any;
  @Prop() warningtime: any;
  @Prop() onRemainingWarning: any;

  @State() title: string = "";

  @State() stopAnimation: string = "";

  convertToNumber(value: any): number {
    return typeof value === "string" ? parseFloat(value) || 0 : value;
  }

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
          <div class="flex items-center justify-center gap-2">
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
                    : startRecording(
                        false,
                        {
                          maxDuration: this.convertToNumber(this.duration),
                          remainingWarningTime: this.convertToNumber(
                            this.warningtime
                          ),
                          onRemainingWarning: this.onRemainingWarning,
                        },
                        this.apikey,
                        this.success,
                        this.error,
                        this.specialty,
                        this.metadata,
                        this.event,
                        this.professional
                      );
                }
              }}
              disabled={
                !state.microphonePermission ||
                !this.apikey ||
                !this.professional
              }
            >
              <div class="flex items-start justify-start gap-2">
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
            {state.openMenu && (
              <div
                class="
    absolute top-10
    max-[400px]:top:36px min-[300px]:top-32 min-[500px]:top-16
  "
              >
                <daai-config />
              </div>
            )}
          </div>
        );
      case "choosen":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              id="choose-local-consultation"
              onClick={() =>
                startRecording(
                  false,
                  {
                    maxDuration: this.convertToNumber(this.duration),
                    remainingWarningTime: this.convertToNumber(
                      this.warningtime
                    ),
                    onRemainingWarning: this.onRemainingWarning,
                  },
                  this.apikey,
                  this.success,
                  this.error,
                  this.specialty,
                  this.metadata,
                  this.event,
                  this.professional
                )
              }
            >
              <div class="flex items-center justify-center p-2">Presencial</div>
            </daai-button-with-icon>
            <daai-button-with-icon
              id="choose-telemedicine-consultation"
              onClick={() =>
                state.isChecked
                  ? startRecording(
                      true,
                      {
                        maxDuration: this.convertToNumber(this.duration),
                        remainingWarningTime: this.convertToNumber(
                          this.warningtime
                        ),
                        onRemainingWarning: this.onRemainingWarning,
                      },
                      this.apikey,
                      this.success,
                      this.error,
                      this.specialty,
                      this.metadata,
                      this.event,
                      this.professional
                    )
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
                finishRecording(
                  this.apikey,
                  this.success,
                  this.error,
                  this.specialty,
                  this.metadata,
                  this.event,
                  this.professional
                )
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
                finishRecording(
                  this.apikey,
                  this.success,
                  this.error,
                  this.specialty,
                  this.metadata,
                  this.event,
                  this.professional
                )
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
      default:
        return null;
    }
  }

  render() {
    return <div>{this.renderButtons()}</div>;
  }
}

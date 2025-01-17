import { Component, h, Prop, State } from "@stencil/core";
import {
  finishRecording,
  pauseRecording,
  resumeRecording,
  startRecording,
  StartTutorial,
} from "../../../core/Recorder";
import state from "../../../store";

@Component({
  tag: "daai-consultation-actions",
  styleUrl: "daai-consultation-actions.css",
  shadow: false,
})
export class DaaiConsultationActions {
  @Prop() apikey: any;
  @Prop() specialty: any;
  @Prop() telemedicine: boolean;
  @Prop() success: any;
  @Prop() error: any;
  @Prop() metadata: string;
  @Prop() event: any;
  @Prop() professional: string;

  @State() title: string = "";

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
    const storedValue = localStorage.getItem("checkboxState");
    state.isChecked = storedValue !== null ? JSON.parse(storedValue) : "";
    console.log("state.chooseSpecialty", state.chooseSpecialty);
    this.title = `Especialidade`;
  }

  openConfigModal() {
    state.openMenu = true;
  }

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
                  : "SOAP GENERALISTA"}
              </daai-button-with-icon>
            )}
            <daai-button-with-icon
              title="Iniciar Registro"
              id="start-recording"
              onClick={() =>
                this.telemedicine ? this.choosenMode() : startRecording(false)
              }
              disabled={!state.microphonePermission}
            >
              Iniciar Registro
            </daai-button-with-icon>

            <daai-button-with-icon
              id="button-menu"
              onClick={this.openConfigModal}
            >
              <daai-menu-icon />
            </daai-button-with-icon>
            {state.openMenu && <daai-config />}
          </div>
        );
      case "choosen":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              title="Iniciar Registro Presencial"
              id="choose-local-consultation"
              onClick={() => startRecording(false)}
            >
              Presencial
            </daai-button-with-icon>
            <daai-button-with-icon
              title="Iniciar Registro Telemedicina"
              id="choose-telemedicine-consultation"
              onClick={() =>
                state.isChecked ? startRecording(true) : StartTutorial()
              }
            >
              Telemedicina
            </daai-button-with-icon>
            <daai-button-with-icon
              title="voltar ao inicio"
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
              title="Pausar Registro"
              id="pause-recording"
              onClick={() => pauseRecording()}
            >
              <daai-pause-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              title="Finalizar Registro"
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
            <daai-button-with-icon
              title="Pausar Registro"
              id="pause-recording-disabled"
              disabled
            >
              <daai-pause-icon />
            </daai-button-with-icon>
            <daai-button-with-icon
              title="Retomar Registro"
              id="start-recording"
              onClick={() => resumeRecording()}
            >
              Retomar Registro
            </daai-button-with-icon>
            <daai-button-with-icon
              title="Retomar Registro"
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
            <daai-button-with-icon
              id="button-menu"
              onClick={this.openConfigModal}
            >
              <daai-menu-icon />
            </daai-button-with-icon>
            {state.openMenu && <daai-config />}
          </div>
        );
      case "upload-ok":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon
              title="Iniciar Novo Registro"
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

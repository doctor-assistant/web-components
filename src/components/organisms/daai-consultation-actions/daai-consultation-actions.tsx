import { Component, h, Prop, State, Watch, Element } from "@stencil/core";
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
import {
  ConsultationReportSchema,
  ConsultationResponse,
} from "../../entities/consultation.entity";

@Component({
  tag: "daai-consultation-actions",
  styleUrl: "daai-consultation-actions.css",
  shadow: false,
})
export class DaaiConsultationActions {
  @Element() el: HTMLElement;

  @Prop() apikey: any = "";
  @Prop() specialty: any;
  @Prop() telemedicine: boolean;
  @Prop() videoElement?: HTMLVideoElement;
  @Prop() professional: string = "";
  @Prop() referenciaExterna?: string;

  @Prop() success: (consultation: ConsultationResponse) => void;
  @Prop() error: any;
  @Prop() metadata: Record<string, any>;
  @Prop() reportSchema?: ConsultationReportSchema;
  @Prop() event: any;
  @Prop() mode: string;
  @Prop() start: (consultation: ConsultationResponse) => void;

  @State() title: string = "";
  @State() stopAnimation: string = "";

  @Prop() recordingTime: number = 0;
  @Prop() recordingConfig?: {
    onWarningRecordingTime?: () => void;
    maxRecordingTime: number;
    warningRecordingTime: number;
  };

  @Prop() hideTutorial: boolean = false;




  @Prop() skipConsultationType: boolean = false;

  isTrue(val: any): boolean {
    if (val === false || val === undefined || val === null) return false;
    if (typeof val === 'string' && val.toLowerCase() === 'false') return false;
    return Boolean(val);
  }
toBool(val: any): boolean {
    if (val === '' || val === true || val === 1 || val === 'true') return true;
    return false;
  }

  newRecording() {
    state.status = "initial";
  }

  async choosenMode() {

  if (this.isTrue(this.skipConsultationType)) {
      return;
    }
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
    const specialtyByProfessionalId = await getSpecialtiesByProfessionalId(this.professional);
    if (specialtyByProfessionalId.mostRecentSpecialty && specialtyByProfessionalId.specialtiesAsStrings) {
      state.specialtyTitle = specialtyByProfessionalId.mostRecentSpecialty.title;
      state.chooseSpecialty = specialtyByProfessionalId.mostRecentSpecialty.id;
    }

    const storedValue = localStorage.getItem("checkboxState");
    state.isChecked = storedValue !== null ? JSON.parse(storedValue) : "";
    this.title = `Especialidade`;
  }

  @Watch("recordingTime")
  handleRecordingTimeChange() {
    if (!this.recordingConfig) return;
    const { maxRecordingTime, warningRecordingTime, onWarningRecordingTime } = this.recordingConfig;

    const emitWarning =
      maxRecordingTime - this.recordingTime === warningRecordingTime &&
      typeof onWarningRecordingTime === "function";

    if (emitWarning) {
      onWarningRecordingTime!();
    }

    if (this.recordingTime >= maxRecordingTime) {
      finishRecording({
        mode: this.mode,
        apikey: this.apikey,
        success: this.success,
        error: this.error,
        specialty: this.specialty,
        onEvent: this.event,
      });
    }
  }

  openConfigModal() {
    state.openMenu = true;
    state.isOpenMenuToCancelAnimation = true;
    localStorage.setItem("isOpenMenuToCancelAnimation", JSON.stringify(state.isOpenMenuToCancelAnimation));
  }


  private canStart = () => Boolean(this.professional && this.apikey);

  renderButtons() {
  if (this.skipConsultationType && ["initial", "choosen"].includes(state.status)) {
      const canStartNow = this.canStart();
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
                {state.specialtyTitle ? state.specialtyTitle : "Generalista"}
              </daai-button-with-icon>
            )}
            <daai-button-with-icon
              id={canStartNow ? "start-recording" : "start-recording-disabled"}
              disabled={!canStartNow}
              onClick={() => {
                if (!canStartNow) return;
                if (this.isTrue(this.skipConsultationType)) {
                  // Forçar leitura do DOM se necessário
                  let referenciaExterna = this.referenciaExterna;
                  if (!referenciaExterna) {
                    const parentElement = this.el?.closest('daai-consultation-recorder');
                    referenciaExterna = parentElement?.getAttribute('referenciaexterna') || parentElement?.getAttribute('referenciaExterna') || undefined;
                  }

                  startRecording({
                    isRemote: !!this.telemedicine,
                    videoElement: this.telemedicine ? this.videoElement : undefined,
                    mode: this.mode,
                    apikey: this.apikey,
                    professional: this.professional,
                    metadata: this.metadata,
                    referenciaExterna: referenciaExterna,
                    start: this.start,
                  });
                } else {
                  this.telemedicine
                    ? this.choosenMode()
                    : startRecording({
                        isRemote: false,
                        mode: this.mode,
                        apikey: this.apikey,
                        professional: this.professional,
                        metadata: this.metadata,
                        referenciaExterna: this.referenciaExterna,
                        start: this.start,
                      });
                }
              }}
            >
              <div class="flex items-center justify-start gap-2">
                <daai-mic-icon></daai-mic-icon>
                <daai-text text="Iniciar Registro"></daai-text>
              </div>
            </daai-button-with-icon>

            <daai-button-with-icon id="button-menu" onClick={this.openConfigModal}>
              <daai-menu-icon />
            </daai-button-with-icon>
          </div>
          {state.openMenu && <daai-config />}
        </div>
      );
    }
    // Caso contrário, segue para o switch normalmente

    // Fluxo tradicional
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
                  {state.specialtyTitle ? state.specialtyTitle : "Generalista"}
                </daai-button-with-icon>
              )}
              <daai-button-with-icon
                id={this.canStart() ? "start-recording" : "start-recording-disabled"}
                onClick={() => {
                  if (!this.canStart()) return;
                  this.telemedicine
                    ? this.choosenMode()
                    : startRecording({
                        isRemote: false,
                        mode: this.mode,
                        apikey: this.apikey,
                        professional: this.professional,
                        metadata: this.metadata,
                        referenciaExterna: this.referenciaExterna,
                        start: this.start,
                      });
                }}
                disabled={!this.canStart()}
              >
                <div class="flex items-center justify-start gap-2">
                  <daai-mic-icon></daai-mic-icon>
                  <daai-text text="Iniciar Registro"></daai-text>
                </div>
              </daai-button-with-icon>

              <daai-button-with-icon id="button-menu" onClick={this.openConfigModal}>
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
              onClick={() => {
                // Forçar leitura do DOM se necessário
                let referenciaExterna = this.referenciaExterna;
                if (!referenciaExterna) {
                  const parentElement = this.el?.closest('daai-consultation-recorder');
                  referenciaExterna = parentElement?.getAttribute('referenciaexterna') || parentElement?.getAttribute('referenciaExterna') || undefined;
                }

                startRecording({
                  isRemote: false,
                  mode: this.mode,
                  apikey: this.apikey,
                  professional: this.professional,
                  metadata: this.metadata,
                  referenciaExterna: referenciaExterna,
                  start: this.start,
                });
              }}
            >
              <div class="flex items-center justify-center p-2">Presencial</div>
            </daai-button-with-icon>

            <daai-button-with-icon
              id="choose-telemedicine-consultation"
              onClick={() => {
                if (state.isChecked || this.hideTutorial) {
                  // Forçar leitura do DOM se necessário
                  let referenciaExterna = this.referenciaExterna;
                  if (!referenciaExterna) {
                    const parentElement = this.el?.closest('daai-consultation-recorder');
                    referenciaExterna = parentElement?.getAttribute('referenciaexterna') || parentElement?.getAttribute('referenciaExterna') || undefined;
                  }

                  startRecording({
                    isRemote: true,
                    videoElement: this.videoElement,
                    mode: this.mode,
                    apikey: this.apikey,
                    professional: this.professional,
                    metadata: this.metadata,
                    referenciaExterna: referenciaExterna,
                    start: this.start,
                  });
                } else {
                  StartTutorial();
                }
              }}
            >
              Telemedicina
            </daai-button-with-icon>

            <daai-button-with-icon id="button-resume" onClick={() => this.newRecording()}>
              <daai-resume-recording-icon />
            </daai-button-with-icon>
          </div>
        );

      case "recording":
      case "resume":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon id="pause-recording" onClick={() => pauseRecording()}>
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
                  onEvent: this.event,
                  reportSchema: this.reportSchema,
                })
              }
            >
              Finalizar Registro
            </daai-button-with-icon>
          </div>
        );

      case "paused":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon id="pause-recording-disabled" disabled>
              <daai-pause-icon />
            </daai-button-with-icon>

            <daai-button-with-icon id="start-recording" onClick={() => resumeRecording()}>
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
                  onEvent: this.event,
                })
              }
            >
              Finalizar Registro
            </daai-button-with-icon>
          </div>
        );

      case "upload":
        return (
          <div class="flex items-center justify-center gap-2">
            <daai-button-with-icon id="new-recording" onClick={() => this.newRecording()}>
              Novo Registro
            </daai-button-with-icon>
          </div>
        );

      case "error":
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

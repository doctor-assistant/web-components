import { Component, h, Host, Prop, State } from "@stencil/core";
import {
  retryChunkedConsultations,
  retryOldConsultations,
  startRecording,
  finishRecording,
} from "../../../core/Recorder";
import state from "../../../store";
import { getSpecialty } from "../../../utils/Specialty";
import { saveSpecialties } from "../../../utils/indexDb";
import { getReportSchema } from "../../../utils/json-schema";
import {
  ConsultationReportSchema,
  ConsultationResponse,
} from "../../entities/consultation.entity";

@Component({
  tag: "daai-consultation-recorder",
  styleUrl: "daai-consultation-recorder.css",
  shadow: true,
})
export class DaaiConsultationRecorder {
  @Prop() onSuccess: (consultation: ConsultationResponse) => void;
  @Prop() onError: (err: Error) => void;
  @Prop() onEvent: (response: Response) => void;
  @Prop() onWarningRecordingTime: () => void;
  @Prop() onStart: (consultation: ConsultationResponse) => void;

  @Prop() apikey: string;
  @Prop() specialty: string = state.chooseSpecialty;
  @Prop() metadata: string;
  @Prop() reportSchema?: string;
  @Prop() prescriptionData?: string;
  @Prop() telemedicine: boolean;
  @Prop() videoElement?: HTMLVideoElement;
  @Prop() professional: string;
  @State() recordingTime: number = 0;

  @Prop() warningRecordingTime: number = 0;
  @Prop() maxRecordingTime: number = Infinity;

  @Prop() hideTutorial: boolean = false;
  @State() mode: string;

  @Prop() skipConsultationType: boolean = false;
  /** Iniciar automaticamente ao montar */
  @Prop() autoStart: boolean = false;
  /** Finalizar automaticamente ao receber evento global */
  @Prop() autoFinishOnEvent: boolean = false;
  /** Nome do evento do prontuário para auto-finalizar */
  @Prop() finishEventName?: string;

  handleRecordingTimeUpdated(event: CustomEvent) {
    this.recordingTime = event.detail;
  }

  get showClock() {
    const allowedStates = ["recording", "paused", "resume"];
    return allowedStates.includes(state.status);
  }

  get metadataObject() {
    try {
      return JSON.parse(this.metadata);
    } catch {
      return {};
    }
  }

  get prescriptionDataObject() {
    try {
      if (!this.prescriptionData) return undefined;
      const prescriptionData = JSON.parse(this.prescriptionData);
      // Validate prescription data
      // Validate provider
      const allowedProviders = ["MEVO", "MEMED"];
      if (!allowedProviders.includes(prescriptionData.provider)) {
        throw new Error(`Invalid provider: ${prescriptionData.provider}`);
      }
      // Validate externalReference
      if (!prescriptionData.externalReference) {
        throw new Error(`Invalid external reference: ${prescriptionData.externalReference}`);
      }
      return prescriptionData;
    } catch (error) {
      state.status = "prescription-data-error";
      console.error("Invalid prescription data", error);
      return undefined;
    }
  }

  get reportSchemaObject(): ConsultationReportSchema | undefined {
    if (!this.reportSchema) return undefined;
    const result = getReportSchema(this.reportSchema);
    if (result.error) {
      console.error("Invalid report schema", result.error);
      state.status = "report-schema-error";
      return undefined;
    }
    state.reportSchema = result.success;
    return result.success;
  }

  private onExternalFinish = () => {
    const specialty =
      this.specialty || state.defaultSpecialty || state.chooseSpecialty || "generic";

    finishRecording({
      mode: this.mode,
      apikey: this.apikey,
      success: this.onSuccess,
      error: this.onError,
      onEvent: this.onEvent,
      specialty,
      reportSchema: this.reportSchemaObject,
    });
  };

  async componentWillLoad() {
    this.mode = this.apikey && /PRODUCTION/i.test(this.apikey) ? "prod" : "dev";
    const spec = await getSpecialty(this.mode);
    await saveSpecialties(spec);
  }

  async componentDidLoad() {
    if (this.specialty) {
      state.defaultSpecialty = this.specialty;
    }
    await retryOldConsultations(this.mode, this.apikey);
    await retryChunkedConsultations(this.mode, this.apikey);


    if (this.skipConsultationType) {
      state.status = "initial";
    }

    const shouldAutoStart = this.autoStart;
    const shouldAutoFinishOnEvent = this.autoFinishOnEvent;
    const eventName = this.finishEventName;

    if (shouldAutoStart) {
      startRecording({
        isRemote: this.telemedicine ?? !!state.telemedicine,
        mode: this.mode,
        apikey: this.apikey,
        professional: this.professional,
        metadata: this.metadataObject,
        start: this.onStart,
      });
    }

    if (shouldAutoFinishOnEvent && eventName) {
      window.addEventListener(eventName, this.onExternalFinish);
    }
  }

  disconnectedCallback() {
    const eventName = this.finishEventName;
    if (this.autoFinishOnEvent && eventName) {
      window.removeEventListener(eventName, this.onExternalFinish);
    }
  }

  render() {
    return (
      <Host>
        <slot>
          <div id="daai-consultation-recorder">
            <div>
              <div class="items-center flex gap-3">
                <daai-mic></daai-mic>
                <daai-clock
                  class={!this.showClock && "hidden"}
                  onRecordingTimeUpdated={this.handleRecordingTimeUpdated.bind(this)}
                  status={state.status}
                />
              </div>
            </div>

            <div id="buttons-section">
              <daai-consultation-actions
                apikey={this.apikey}
                specialty={state.defaultSpecialty || state.chooseSpecialty}
                metadata={this.metadataObject}
                prescriptionData={this.prescriptionDataObject}
                reportSchema={this.reportSchemaObject}
                success={this.onSuccess}
                error={this.onError}
                telemedicine={this.telemedicine}
                videoElement={this.videoElement}
                event={this.onEvent}
                professional={this.professional}
                recordingTime={this.recordingTime}
                recordingConfig={{
                  onWarningRecordingTime: this.onWarningRecordingTime,
                  warningRecordingTime: this.warningRecordingTime,
                  maxRecordingTime: this.maxRecordingTime,
                }}
                hideTutorial={
                  this.hideTutorial || (this.videoElement && this.videoElement !== null)
                }
                mode={this.mode}
                start={this.onStart}
                skipConsultationType={this.skipConsultationType}
              ></daai-consultation-actions>
            </div>
          </div>
        </slot>

        {state.openModalConfig && (
          <daai-modal
            headerTitle="Escolha o seu microfone"
            items={state.availableMicrophones}
          />
        )}

        {state.openTutorialPopup && !this.hideTutorial && (
          <daai-popup
            class="popup"
            mode={this.mode}
            apikey={this.apikey}
            professional={this.professional}
            metadata={this.metadataObject}
            start={this.onStart}
          ></daai-popup>
        )}

        {state.openModalSpecialty && <daai-specialty professional={this.professional} />}
      </Host>
    );
  }
}

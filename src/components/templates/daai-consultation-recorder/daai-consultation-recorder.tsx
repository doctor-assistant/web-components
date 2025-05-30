import { Component, h, Host, Prop, State } from "@stencil/core";
import {
  retryChunkedConsultations,
  retryOldConsultations,
} from "../../../core/Recorder";
import state from "../../../store";
import { getSpecialty } from "../../../utils/Specialty";
import { saveSpecialties } from "../../../utils/indexDb";
import {
  ConsultationReportSchema,
  ConsultationResponse,
} from "../../entities/consultation.entity";
import { getReportSchema } from "../../../utils/json-schema";

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
  @Prop() telemedicine: boolean;
  @Prop() videoElement?: HTMLVideoElement;
  @Prop() professional: string;
  @State() recordingTime: number = 0;

  @Prop() warningRecordingTime: number = 0;
  @Prop() maxRecordingTime: number = Infinity;
  @Prop() mediaStreamByPatient: MediaStream;

  @Prop() hideTutorial: boolean = false;
  @State() mode: string;

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
    } catch (e) {
      return {};
    }
  }

  get reportSchemaObject(): ConsultationReportSchema | undefined {
    if (!this.reportSchema) return undefined;

    const result = getReportSchema(this.reportSchema);
    if (result.error) {
      console.error('Invalid report schema', result.error);
      state.status = "report-schema-error";
      return undefined;
    }
    state.reportSchema = result.success;
    return result.success;
  }

  async componentDidLoad() {
    if (this.specialty) {
      state.defaultSpecialty = this.specialty;
    }
    await retryOldConsultations(this.mode, this.apikey);
    await retryChunkedConsultations(this.mode, this.apikey);
  }

  async componentWillLoad() {
    this.mode = this.apikey && /PRODUCTION/i.test(this.apikey) ? "prod" : "dev";
    const spec = await getSpecialty(this.mode);
    await saveSpecialties(spec);
  }
  isUndefined = (item: any): item is undefined => typeof item === "undefined";

  isNull = (item: any): item is null => item === null;

  isNullish = (item: any): item is null | undefined =>
    this.isNull(item) || this.isUndefined(item);

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
                  onRecordingTimeUpdated={this.handleRecordingTimeUpdated.bind(
                    this
                  )}
                  status={state.status}
                />
              </div>
            </div>
            <div id="buttons-section">
              <daai-consultation-actions
                apikey={this.apikey}
                specialty={state.defaultSpecialty || state.chooseSpecialty}
                metadata={this.metadataObject}
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
                  this.hideTutorial ||
                  !this.isNullish(this.videoElement) ||
                  !this.isNullish(this.mediaStreamByPatient)
                }
                mode={this.mode}
                start={this.onStart}
                mediaStreamByPatient={this.mediaStreamByPatient}
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
            mediaStreamByPatient={this.mediaStreamByPatient}
          ></daai-popup>
        )}

        {state.openModalSpecialty && (
          <daai-specialty professional={this.professional} />
        )}
      </Host>
    );
  }
}

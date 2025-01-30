import { Component, h, Host, Prop, State } from "@stencil/core";
import state from "../../../store";
import { getSpecialty } from "../../../utils/Specialty";
import { saveSpecialties } from "../../../utils/indexDb";
@Component({
  tag: "daai-consultation-recorder",
  styleUrl: "daai-consultation-recorder.css",
  shadow: true,
})
export class DaaiConsultationRecorder {
  @Prop() onSuccess: (response: Response) => void;
  @Prop() onError: (err: Error) => void;
  @Prop() onEvent: (response: Response) => void;
  @Prop() onWarningRecordingTime: () => void;

  @Prop() apikey: string;
  @Prop() specialty: string = state.chooseSpecialty;
  @Prop() metadata: string;
  @Prop() telemedicine: boolean;
  @Prop() professional: string;
  @State() recordingTime: number = 0;

  @Prop() warningRecordingTime: number = 0;
  @Prop() maxRecordingTime: number = Infinity;

  @Prop() hideTutorial: boolean = false;

  handleRecordingTimeUpdated(event: CustomEvent) {
    this.recordingTime = event.detail;
  }

  async componentDidLoad() {
    const mode =
      this.apikey && /PRODUCTION/i.test(this.apikey) ? "prod" : "dev";
    if (this.specialty) {
      state.defaultSpecialty = this.specialty;
    }
    const spec = await getSpecialty(mode);
    await saveSpecialties(spec);
  }

  render() {
    return (
      <Host>
        <slot>
          <div id="daai-consultation-recorder">
            <div>
              <div class="items-center flex gap-3">
                <daai-mic></daai-mic>
                {state.status === "recording" ||
                  state.status === "paused" ||
                  state.status === "resume" ? (
                  <daai-clock onRecordingTimeUpdated={this.handleRecordingTimeUpdated.bind(this)} status={state.status} />
                ) : (
                  ""
                )}
              </div>
            </div>
            {state.status === "choosen" ? (
              <daai-text text="Consulta" id="choosen-mode" />
            ) : (
              ""
            )}
            {state.status === "finished" ? (
              <daai-text
                text="Aguarde enquanto geramos o registro final..."
                id="upload-text"
              />
            ) : (
              state.status === "upload-ok" && (
                <daai-text text="Registro Finalizado!" id="upload-text" />
              )
            )}

            <div class="min-[500px]:ml-auto flex gap-2 items-center">
              <daai-consultation-actions
                apikey={this.apikey}
                specialty={state.defaultSpecialty || state.chooseSpecialty}
                metadata={this.metadata}
                success={this.onSuccess}
                error={this.onError}
                telemedicine={this.telemedicine}
                event={this.onEvent}
                professional={this.professional}
                recordingTime={this.recordingTime}
                recordingConfig={{
                  onWarningRecordingTime: this.onWarningRecordingTime,
                  warningRecordingTime: this.warningRecordingTime,
                  maxRecordingTime: this.maxRecordingTime
                }}
                hideTutorial={this.hideTutorial}
              ></daai-consultation-actions>
            </div>
          </div>
        </slot>
        {state.openModalConfig && (
          <daai-modal
            headerTitle="Escolha o seu Microfone"
            items={state.availableMicrophones}
          />
        )}

        {state.openTutorialPopup && !this.hideTutorial && <daai-popup class="popup"></daai-popup>}

        {state.openModalSpecialty && (
          <daai-specialty professional={this.professional} />
        )}
      </Host>
    );
  }
}

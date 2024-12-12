import { Component, h, Host, Prop } from "@stencil/core";
import state from "../../../Store/RecorderComponentStore";

@Component({
  tag: "daai-consultation-recorder",
  styleUrl: "daai-consultation-recorder.css",
  shadow: true,
})
export class DaaiConsultationRecorder {
  @Prop() apiKey: string;
  @Prop() specialty: string;
  @Prop() onSuccess: any;
  @Prop() onError: any;
  @Prop() metadata: string;

  render() {
    console.log("apiKey:", this.apiKey);
    console.log(state.chooseModality, "state.chooseModality");
    return (
      <Host>
        <slot>
          <div class="bg-white flex items-center justify-between rounded-lg border-4 border-gray-100 p-2">
            <daai-mic></daai-mic>
            {state.status === "choosen" ? (
              <daai-text text="Consulta" id="choosen-mode" />
            ) : (
              ""
            )}
            <div class="ml-auto flex gap-2 items-center">
              {state.status === "recording" ||
              state.status === "paused" ||
              state.status === "resume" ? (
                <daai-clock status={state.status} />
              ) : (
                ""
              )}
              <daai-consultation-actions
                apiKey={this.apiKey}
                specialty={this.specialty}
                metadata={this.metadata}
                onError={this.onError}
                onSuccess={this.onSuccess}
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
      </Host>
    );
  }
}

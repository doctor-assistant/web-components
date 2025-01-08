import { Component, h, State } from "@stencil/core";
import state from "../../../Store/RecorderComponentStore";

@Component({
  tag: "daai-specialty",
  styleUrl: "daai-specialty.css",
  shadow: true,
})
export class DaaiSpecialty {
  @State() specialtyList: Array<{ title: string; id: string }> = [];

  @State() chooseSpecialty: string = state.chooseSpecialty || "generic";

  handleClick() {
    state.openModalSpecialty = false;
  }

  handleChooseSpecialty() {
    if (this.chooseSpecialty) {
      state.chooseSpecialty = this.chooseSpecialty;
      state.openModalSpecialty = false;
    } else {
      console.warn("Nenhuma especialidade foi selecionada.");
    }
  }

  render() {
    return (
      <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
        <div class="w-96 p-4 rounded-md border-2 border-gray-200 mt-4 bg-white">
          <div class="flex gap-24 space-x-8">
            <p class="text-md text-gray-600 mb-4">
              Escolha a sua Especialidade
            </p>
            <daai-button
              class="text-black font-medium  text-sm mb-4"
              onClick={() => this.handleClick()}
            >
              X
            </daai-button>
          </div>
          <div class="w-full h-64 overflow-y-auto border p-4">
            <ul class="space-y-2">
              {state.specialtyList.map((specialty) => (
                <li
                  class={`cursor-pointer p-3 rounded-lg border transition
                  ${
                    this.chooseSpecialty === specialty.id
                      ? "bg-gray-500 text-white border-gray-600"
                      : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                  }`}
                  onClick={() => (this.chooseSpecialty = specialty.id)}
                >
                  {specialty.title}
                </li>
              ))}
            </ul>
          </div>
          <div class="flex items-start justify-end gap-2 mt-2">
            <daai-button
              class="text-white bg-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              onClick={() => this.handleChooseSpecialty()}
            >
              Escolher Especialidade
            </daai-button>
          </div>
        </div>
      </div>
    );
  }
}

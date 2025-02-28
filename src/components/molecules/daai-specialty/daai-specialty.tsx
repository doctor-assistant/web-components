import { Component, h, Prop, State } from "@stencil/core";
import state from "../../../store";
import { saveSpecialtyByProfessionalId } from "../../../utils/indexDb";

@Component({
  tag: "daai-specialty",
  styleUrl: "daai-specialty.css",
  shadow: false,
})
export class DaaiSpecialty {
  @Prop() professional: string;

  @State() specialtyList: Array<{ title: string; id: string }> =
    state.specialtyList || [];
  @State() chooseSpecialty: string = state.chooseSpecialty || "generic";
  @State() chooseSpecialtyTitle: string = state.specialtyTitle || "GENERALISTA";
  @State() searchQuery: string = "";

  get filteredSpecialtyList() {
    return this.specialtyList.filter((specialty) =>
      specialty.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  componentDidLoad() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.handleClick();
    }
  }

  handleClick() {
    state.openModalSpecialty = false;
  }

  handleChooseSpecialty() {
    if (this.chooseSpecialty) {
      state.chooseSpecialty = this.chooseSpecialty;
      state.specialtyTitle = this.chooseSpecialtyTitle;
      state.openModalSpecialty = false;
      saveSpecialtyByProfessionalId(this.professional, this.chooseSpecialty);
    } else {
      console.warn("Nenhuma especialidade foi selecionada.");
    }
  }

  handleSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  render() {
    return (
      <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
        <div class="w-96 p-4 rounded-md border-2 border-gray-200 mt-4 bg-white">
          <div class="flex gap-24 space-x-8 font-semibold">
            <h2>Escolha a sua Especialidade</h2>
            <daai-button
              class="text-black font-medium text-sm mb-4"
              onClick={() => this.handleClick()}
            >
              X
            </daai-button>
          </div>
          <input
            type="text"
            class="w-full p-2 mb-3 border rounded-md"
            placeholder="Busque a sua especialidade"
            onInput={(event) => this.handleSearch(event)}
            value={this.searchQuery}
            id="search-input"
          />
          <div class="w-full h-64 overflow-y-auto border p-4">
            <ul class="space-y-2">
              {this.filteredSpecialtyList.map((specialty) => (
                <li
                  key={specialty.id}
                  id={
                    this.chooseSpecialty === specialty.id
                      ? "choose-specialty"
                      : "default-specialty"
                  }
                  onClick={() => {
                    this.chooseSpecialty = specialty.id;
                    this.chooseSpecialtyTitle = specialty.title;
                  }}
                >
                  {specialty.title}
                </li>
              ))}
            </ul>
          </div>
          <div class="flex items-start justify-end gap-2 mt-2">
            <daai-button
              id="choose-specialty-button"
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

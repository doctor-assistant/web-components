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

  handleChooseSpecialty(specialty: { title: string; id: string }) {
    this.chooseSpecialty = specialty.id;
    this.chooseSpecialtyTitle = specialty.title;
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
      <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-[9999]">
        <div class="w-96 px-5 pt-5 pb-8 rounded-md mt-4 bg-white">
          <div class="flex justify-between">
            <span class="text-[12px] font-[600] modal-title" id="specialty-title">Escolha a sua especialidade</span>
            <daai-button
              class="text-black font-medium text-sm mb-4"
              onClick={() => this.handleClick()}
            >
              X
            </daai-button>
          </div>
          <input
            type="text"
            class="w-full px-2 py-3 mb-6 -translate-y-2 border rounded-md text-[12px]"
            placeholder="Busque por sua especialidade"
            onInput={(event) => this.handleSearch(event)}
            value={this.searchQuery}
            id="search-specialty-input"
          />
          <div class="w-[calc(100%+18px)] h-64 overflow-y-scroll">
            <ul class="space-y-2 pr-1">
              {this.filteredSpecialtyList.map((specialty) => (
                <li
                  key={specialty.id}
                  class={
                    this.chooseSpecialty === specialty.id
                      ? "selected-modal-item"
                      : "modal-item"
                  }
                  onClick={() => {
                    this.handleChooseSpecialty(specialty);
                  }}
                >
                  {specialty.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

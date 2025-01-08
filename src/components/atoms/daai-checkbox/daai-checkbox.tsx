import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core";
import state from "../../../Store/RecorderComponentStore";

@Component({
  tag: "daai-checkbox",
  styleUrl: "daai-checkbox.css",
  shadow: true,
})
export class DaaiCheckbox {
  @Prop() checked: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() label: string = "";

  @Event() change: EventEmitter<boolean>;
  @State() isChecked: boolean;

  componentWillLoad() {
    const storedValue = localStorage.getItem("checkboxState");
    this.isChecked =
      storedValue !== null ? JSON.parse(storedValue) : this.checked;
    state.isChecked = this.isChecked;
  }

  private handleToggle = () => {
    if (!this.disabled) {
      this.isChecked = !this.isChecked;
      localStorage.setItem("checkboxState", JSON.stringify(this.isChecked));
      state.isChecked = this.isChecked;
      this.change.emit(this.isChecked);
    }
  };

  render() {
    return (
      <div class="flex items-center">
        <input
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          type="checkbox"
          checked={this.isChecked}
          disabled={this.disabled}
          onChange={this.handleToggle}
          id="checkbox"
        />
        <label
          htmlFor="checkbox"
          class="ms-2 text-sm font-medium text-gray-900"
        >
          {this.label}
        </label>
      </div>
    );
  }
}

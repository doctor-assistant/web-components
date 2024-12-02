import { Component, h, Prop, State } from '@stencil/core';
import state from '../../../Store/RecorderComponentStore';

@Component({
  tag: 'daai-modal',
  styleUrl: 'daai-modal.css',
  shadow: true,
})
export class DaaiModal {
  @State() items: { id: number; label: string; selected: boolean }[] = [
    { id: 1, label: 'Mock Item 1', selected: false },
    { id: 2, label: 'Mock Item 2', selected: false },
    { id: 3, label: 'Mock Item 3', selected: false },
    { id: 4, label: 'Mock Item 4', selected: false },
    { id: 5, label: 'Mock Item 1', selected: false },
    { id: 6, label: 'Mock Item 2', selected: false },
    { id: 7, label: 'Mock Item 3', selected: false },
    { id: 8, label: 'Mock Item 4', selected: false },
  ];
  @Prop() headerTitle = ''

  handleClick(){
    state.openModalConfig = false
 }

  toggleSelection(itemId: number) {
    this.items = this.items.map(item =>
      item.id === itemId
        ? { ...item, selected: true }
        : { ...item, selected: false }
    );
  }

  render() {
    return (
      <div class="p-4 rounded-md border-2 border-gray-200 mt-4">
        <p class="text-md text-gray-600 mb-4">
          {this.headerTitle}
        </p>
        <div class="w-full h-64 overflow-y-auto border p-4">
        <ul class="space-y-2">
          {this.items.map(item => (
            <li
              class={`cursor-pointer p-3 rounded-lg border transition
                ${
                  item.selected
                    ? 'bg-gray-500 text-white border-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                }`}
              onClick={() => this.toggleSelection(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        </div>
        <daai-button class='bg-gray-500 p-2 rounded-md mt-2 text-white' onClick={this.handleClick}>
          Fechar
        </daai-button>
      </div>
    );
  }
}

import { newSpecPage } from '@stencil/core/testing';
import { DaaiModal } from '../daai-modal';

describe('daai-modal', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        enumerateDevices: jest.fn().mockResolvedValue([
          { deviceId: '123', kind: 'audioinput', label: 'Microfone 1' },
          { deviceId: '456', kind: 'audioinput', label: 'Microfone 2' },
        ] as MediaDeviceInfo[]),
      },
      writable: true,
    });
  });


  it('Renderiza corretamente o daaai-modal', async () => {
    const page = await newSpecPage({
      components: [DaaiModal],
      html: `<daai-modal header-title="Selecione um Microfone"></daai-modal>`,
    });

    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <daai-modal header-title="Selecione um Microfone">
        <mock:shadow-root>
          <div class="w-96 p-4 rounded-md border-2 border-gray-200 mt-4">
            <p class="text-md text-gray-600 mb-4">Selecione um Microfone</p>
            <div class="w-full h-64 overflow-y-auto border p-4">
              <ul class="space-y-2">
                <li class="cursor-pointer p-3 rounded-lg border transition bg-gray-100 hover:bg-gray-200 border-gray-300">
                  Microfone 1
                </li>
                <li class="cursor-pointer p-3 rounded-lg border transition bg-gray-100 hover:bg-gray-200 border-gray-300">
                  Microfone 2
                </li>
              </ul>
            </div>
            <div class="flex items-start justify-start gap-2 mt-2">
              <daai-button class="text-white bg-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                Escolher microfone
              </daai-button>
              <daai-button class="text-white bg-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Fechar
              </daai-button>
            </div>
          </div>
        </mock:shadow-root>
      </daai-modal>
    `);
  });
});

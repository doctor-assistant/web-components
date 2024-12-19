import { newSpecPage } from "@stencil/core/testing";
import { DaaiModal } from "../daai-modal";

describe("daai-modal", () => {
  it("Renderiza corretamente o daai-modal", async () => {
    const page = await newSpecPage({
      components: [DaaiModal],
      html: `<daai-modal header-title="Selecione um Microfone"></daai-modal>`,
    });

    expect(page.root).toEqualHtml(`
      <daai-modal header-title="Selecione um Microfone">
        <mock:shadow-root>
          <div class="border-2 border-gray-200 mt-4 p-4 rounded-md w-96">
            <div class="flex gap-32 space-x-8">
              <p class="mb-4 text-gray-600 text-md">
                Selecione um Microfone
              </p>
              <daai-button class="font-medium mb-4 text-black text-sm">
                X
              </daai-button>
            </div>
            <div class="border h-64 overflow-y-auto p-4 w-full">
              <ul class="space-y-2">
                <li class="bg-gray-100 border border-gray-300 cursor-pointer hover:bg-gray-200 p-3 rounded-lg transition">
                  Microfone 1
                </li>
                <li class="bg-gray-100 border border-gray-300 cursor-pointer hover:bg-gray-200 p-3 rounded-lg transition">
                  Microfone 2
                </li>
              </ul>
            </div>
            <div class="flex gap-2 items-start justify-end mt-2">
              <daai-button class="bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium hover:bg-gray-900 mb-2 me-2 px-5 py-2.5 rounded-lg text-sm text-white">
                Escolher microfone
              </daai-button>
            </div>
          </div>
        </mock:shadow-root>
      </daai-modal>
    `);
  });
});

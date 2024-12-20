import { newSpecPage } from "@stencil/core/testing";
import { DaaiSpecialty } from "../daai-specialty";

describe("daai-specialty", () => {
  it("verifica se o modal de especialidade renderiza corretamente", async () => {
    const page = await newSpecPage({
      components: [DaaiSpecialty],
      html: `<daai-specialty></daai-specialty>`,
    });
    expect(page.root).toEqualHtml(`
     <daai-specialty>
       <template shadowrootmode="open">
         <div class="border-2 border-gray-200 mt-4 p-4 rounded-md w-96">
           <div class="flex gap-24 space-x-8">
             <p class="mb-4 text-gray-600 text-md">
               Escolha a sua Especialidade
             </p>
             <daai-button-with-icon class="font-medium mb-4 text-black text-sm">
               X
             </daai-button-with-icon>
           </div>
           <div class="border h-64 overflow-y-auto p-4 w-full">
             <ul class="space-y-2"></ul>
           </div>
           <div class="flex gap-2 items-start justify-end mt-2">
             <daai-button class="bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium hover:bg-gray-900 mb-2 me-2 px-5 py-2.5 rounded-lg text-sm text-white">
               Escolher Especialidade
             </daai-button>
           </div>
         </div>
       </template>
     </daai-specialty>
    `);
  });
});

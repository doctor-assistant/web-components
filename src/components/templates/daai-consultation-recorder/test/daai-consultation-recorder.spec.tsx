import { newSpecPage } from "@stencil/core/testing";
import { DaaiConsultationRecorder } from "../daai-consultation-recorder";

describe("daai-consultation-recorder", () => {
  it("renderiza corrretamente o daai-consultation-recorder", async () => {
    const page = await newSpecPage({
      components: [DaaiConsultationRecorder],
      html: `<daai-consultation-recorder></daai-consultation-recorder>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-consultation-recorder>
        <mock:shadow-root>
          <slot>
           <div id="daai-consultation-recorder">
              <div>
               <div class="flex gap-6 items-center">
                 <daai-mic></daai-mic>
               </div>
             </div>
             <div class="flex gap-2 items-center min-[380px]:ml-auto">
               <daai-consultation-actions specialty=""></daai-consultation-actions>
             </div>
           </div>
         </slot>
        </mock:shadow-root>
      </daai-consultation-recorder>
    `);
  });
});

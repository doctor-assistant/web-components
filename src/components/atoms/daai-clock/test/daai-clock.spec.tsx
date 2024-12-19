import { newSpecPage } from "@stencil/core/testing";
import { DaaiClock } from "../daai-clock";

describe("daai-clock", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [DaaiClock],
      html: `<daai-clock></daai-clock>`,
    });
    expect(page.root).toEqualHtml(`
      <daai-clock>
        <mock:shadow-root>
          <div class="font-bold text-sm">
           <span>
             00:00:00
           </span>
         </div>
        </mock:shadow-root>
      </daai-clock>
    `);
  });
});

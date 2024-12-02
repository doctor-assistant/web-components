import { newSpecPage } from "@stencil/core/testing";
import { DaaiButton } from "../daai-button";

it('renderiza o daai-button corretamente quando for chamado', async () => {
  const page = await newSpecPage({
    components: [DaaiButton],
    html: `<daai-button></daai-button>`,
  });
  expect(page.root).toMatchInlineSnapshot(`
    <daai-button>
      <template shadowrootmode="open">
        <button type="button">
          <slot></slot>
        </button>
      </template>
    </daai-button>
  `);
});

import { newSpecPage } from "@stencil/core/testing";
import { DaaiSpecialty } from "../daai-specialty";

describe("daai-specialty", () => {
  it("verifica se o modal de especialidade renderiza corretamente", async () => {
    const page = await newSpecPage({
      components: [DaaiSpecialty],
      html: `<daai-specialty></daai-specialty>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});

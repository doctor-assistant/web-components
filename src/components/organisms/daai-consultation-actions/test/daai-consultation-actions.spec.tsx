import { newSpecPage } from "@stencil/core/testing";
import state from "../../../../Store/RecorderComponentStore";
import { DaaiConsultationActions } from "../daai-consultation-actions";

describe("daai-consultation-actions", () => {
  it("Verifica se o daai-consultation-actions renderiza corretamente", async () => {
    const page = await newSpecPage({
      components: [DaaiConsultationActions],
      html: `<daai-consultation-actions apikey="test-key" specialty="cardiology" metadata="test-metadata"></daai-consultation-actions>`,
    });

    expect(page.root).toMatchSnapshot();
  });

  it("chama ChoosenMode e atualiza o estado", async () => {
    const component = new DaaiConsultationActions();
    component.choosenMode();
    expect(state.status).toBe("choosen");
  });

  it("chama ChoosenSpecialty e atualiza o estado", async () => {
    const component = new DaaiConsultationActions();
    component.choosenSpecialty();
    expect(state.openModalSpecialty).toBe(true);
  });

  it("lida com componentDidLoad e atualiza o título", async () => {
    const component = new DaaiConsultationActions();
    component.specialty = "cardiology";

    const mockGetSpecialtyTitle = jest.fn().mockResolvedValue("Cardiology");
    (global as any).getSpecialtyTitle = mockGetSpecialtyTitle;

    await component.componentDidLoad();
    expect(component.title).toBe("Especialidade Cardiology");
    expect(mockGetSpecialtyTitle).toHaveBeenCalledWith("cardiology");
  });

  it("lida com finishRecording e atualiza o estado", async () => {
    const component = new DaaiConsultationActions();
    component.mediaRecorder = {
      state: "recording",
      stop: jest.fn(),
      ondataavailable: null,
      onstop: null,
    } as unknown as MediaRecorder;

    await component.finishRecording();
    expect(state.status).toBe("finished");
    expect(component.mediaRecorder.stop).toHaveBeenCalled();
  });
});

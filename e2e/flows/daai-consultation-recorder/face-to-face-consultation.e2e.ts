import { DaaiConsultationRecorderPageObject } from '../../objects/daai-consultation-recorder.object'

describe('daai-consultation-recorder', () => {
  let recorder: DaaiConsultationRecorderPageObject;

  afterEach(async function () {
    const passingAsserts = expect.getState().numPassingAsserts;
    const assertionCalls = expect.getState().assertionCalls;
    const hasFailed = passingAsserts !== assertionCalls;
    if (expect.getState().currentTestName && hasFailed) {
      const testName = expect.getState().currentTestName.replace(/\s+/g, '-');
      await recorder.screenshot(`failure-${testName}`);
    }
  });

  beforeAll(async () => {
    recorder = await DaaiConsultationRecorderPageObject.createWithVirtualMic();
    await recorder.setApiKey(process.env.API_KEY as string);
    await recorder.setProfessional('e2e-test-id');
    await recorder.allowMicrophone();
  });

  describe('success flow', () => {
    it('should render the component with hydrated class', async () => {
      await recorder.rendered();
    });

    it('should register face-to-face consultation', async () => {
      await recorder.startRecording();
      await recorder.waitForRecording(10);
      await recorder.finishRecording();
    });

    it('should register new face-to-face consultation', async () => {
      await recorder.restartRecording();
      await recorder.startRecording();
      await recorder.waitForRecording(10);
      await recorder.finishRecording();
    });
  });
});

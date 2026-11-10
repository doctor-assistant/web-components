import { classifyUploadStatus } from './upload-outcome';

describe('classifyUploadStatus', () => {
  it('2xx é sucesso', () => {
    expect(classifyUploadStatus(200)).toBe('ok');
    expect(classifyUploadStatus(201)).toBe('ok');
  });

  it('4xx de chunk recusado descarta: reenviar o mesmo arquivo nunca passa', () => {
    for (const status of [400, 404, 413, 422]) {
      expect(classifyUploadStatus(status)).toBe('drop');
    }
  });

  it('408, 429 e 5xx são temporários e voltam para o reenvio', () => {
    for (const status of [408, 429, 500, 503]) {
      expect(classifyUploadStatus(status)).toBe('retry');
    }
  });
});

import { classifyUploadStatus } from './upload-outcome';

describe('classifyUploadStatus', () => {
  it('2xx é sucesso', () => {
    expect(classifyUploadStatus(200)).toBe('ok');
    expect(classifyUploadStatus(201)).toBe('ok');
  });

  it('413 e 422 descartam: o servidor recusou o arquivo e reenviar nunca passa', () => {
    for (const status of [413, 422]) {
      expect(classifyUploadStatus(status)).toBe('drop');
    }
  });

  it('os outros 4xx e os 5xx voltam para o reenvio, sem perder o áudio', () => {
    for (const status of [400, 401, 403, 404, 408, 429, 500, 503]) {
      expect(classifyUploadStatus(status)).toBe('retry');
    }
  });
});

export type UploadOutcome = 'ok' | 'drop' | 'retry';

/**
 * O que fazer com um chunk depois da resposta do upload.
 *
 * 4xx (exceto 408 e 429) quer dizer que o servidor recusou aquele arquivo, por
 * exemplo um WebM só com cabeçalho (422). Reenviar o mesmo arquivo nunca vai
 * passar, e guardá-lo no IndexedDB travaria o finish para sempre: o chunk é
 * descartado. 408, 429 e 5xx são temporários e voltam para o reenvio.
 */
export function classifyUploadStatus(status: number): UploadOutcome {
  if (status >= 200 && status < 300) {
    return 'ok';
  }
  if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
    return 'drop';
  }
  return 'retry';
}

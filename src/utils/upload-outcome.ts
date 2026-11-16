export type UploadOutcome = 'ok' | 'drop' | 'retry';

/**
 * O que fazer com um chunk depois da resposta do upload.
 *
 * Só 413 (arquivo grande demais) e 422 (arquivo que o servidor não consegue
 * ler, como um WebM só com cabeçalho) descartam o chunk: reenviar o mesmo
 * arquivo nunca vai passar, e guardá-lo no IndexedDB travaria o finish para
 * sempre. Qualquer outra falha, inclusive 401, 403 e 404 (chave ou rota com
 * problema, que podem voltar), continua indo para o reenvio, como antes.
 */
const REFUSED_FILE_STATUSES = new Set([413, 422]);

export function classifyUploadStatus(status: number): UploadOutcome {
  if (status >= 200 && status < 300) {
    return 'ok';
  }
  if (REFUSED_FILE_STATUSES.has(status)) {
    return 'drop';
  }
  return 'retry';
}

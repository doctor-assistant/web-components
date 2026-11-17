export type ChunkLimits = { min: number; max: number };

/**
 * O primeiro chunk é curto: até ele subir, o áudio só existe na memória do
 * navegador, e quem fecha a aba ou recarrega a página antes perde tudo
 * (DAAI-1412). Os seguintes continuam longos para não multiplicar chamadas de
 * transcrição. Em segundos: o corte no silêncio vale a partir de `min`, e o
 * corte é forçado em `max`.
 */
export const FIRST_CHUNK: ChunkLimits = { min: 50, max: 60 };
export const NEXT_CHUNKS: ChunkLimits = { min: 270, max: 300 };

export function chunkLimits(index: number): ChunkLimits {
  return index === 0 ? FIRST_CHUNK : NEXT_CHUNKS;
}

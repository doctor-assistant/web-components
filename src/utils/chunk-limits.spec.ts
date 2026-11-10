import { chunkLimits } from './chunk-limits';

describe('chunkLimits', () => {
  it('o primeiro chunk da gravação é curto, para o áudio sair cedo do navegador', () => {
    expect(chunkLimits(0)).toEqual({ min: 50, max: 60 });
  });

  it('os chunks seguintes mantêm 270 a 300 s', () => {
    expect(chunkLimits(1)).toEqual({ min: 270, max: 300 });
    expect(chunkLimits(5)).toEqual({ min: 270, max: 300 });
  });
});

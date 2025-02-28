import { replaceInFile } from 'replace-in-file';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  files: 'src/index.html',
  from: [/apikey=".*?"/g, /professional=".*?"/g],
  to: [
    `apikey="${process.env.API_KEY}"`,
    `professional="${process.env.PROFESSIONAL_ID}"`
  ],
};

try {
  const results = await replaceInFile(options);
  console.log('Substituição de variáveis de ambiente concluída:', results);
} catch (error) {
  console.error('Erro ao substituir variáveis de ambiente:', error);
}
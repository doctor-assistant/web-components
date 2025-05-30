import { replaceInFile } from 'replace-in-file';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  files: 'src/index.html',
  from: [
    // Props
    /apikey=".*?"/g,
    /specialty=".*?"/g,
    /metadata=".*?"/g,
    /telemedicine=".*?"/g,
    /professional=".*?"/g,
    /hideTutorial=".*?"/g,
    /report-schema=".*?"/g,
  ],
  to: [
    //Props
    `apikey="${process.env.API_KEY}"`,
    `specialty="${process.env.SPECIALTY}"`,
    `metadata='${process.env.METADATA}'`,
    `telemedicine="${process.env.TELEMEDICINE}"`,
    `professional="${process.env.PROFESSIONAL_ID}"`,
    `hideTutorial="${process.env.HIDE_TUTORIAL}"`,
    `report-schema='${process.env.REPORT_SCHEMA}'`,
  ],
};

try {
  const results = await replaceInFile(options);
  console.log('Substituição de variáveis de ambiente concluída:', results);
} catch (error) {
  console.error('Erro ao substituir variáveis de ambiente:', error);
}
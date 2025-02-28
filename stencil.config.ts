import { Config } from '@stencil/core';
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin';
import * as dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
  namespace: 'web-components',
  plugins: [
    tailwind(),
    tailwindHMR(),
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: "new",
    browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  env: {
    API_KEY: process.env.API_KEY,
  },
};

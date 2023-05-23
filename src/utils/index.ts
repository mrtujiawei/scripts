import path from 'path';
import { MODE } from '../enums';

export const absolutePath = (...paths: string[]) => {
  return path.resolve(process.cwd(), ...paths);
};

const getMode = (nodeEnv: string) => {
  if (nodeEnv == MODE.PRODUCTION) {
    return MODE.PRODUCTION;
  }
  return MODE.DEVELOPMENT;
};

const getLibName = (libName: string) => {
  if (!libName) {
    throw new Error('"LIB_NAME" is not set');
  }
  return libName;
};

const getOutputPath = (outputPath: string) => {
  return absolutePath(outputPath || '');
};

export const getLibEnv = (mode?: string) => {
  const config = require(absolutePath('package.json'))['#buildConfig'];

  return {
    mode: getMode(mode || config.mode),
    libName: getLibName(config.libName),
    outputDir: getOutputPath(config.outputPath),
  };
};

export const getUmdEnv = (mode?: string) => {
  const config = require(absolutePath('package.json'))['#buildConfig'];

  return {
    mode: getMode(mode || config.mode),
    outputDir: getOutputPath(config.outputPath),
  };
};

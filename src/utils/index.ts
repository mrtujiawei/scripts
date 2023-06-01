import path from 'path';
import { MODE } from '../enums';
import { createHash } from 'crypto';
import { getUmdLibConfig } from '../webpack';
import { config } from 'dotenv';

export const getEnvConfig = () => {
  const result = config({ override: false });
  return result.parsed || {};
};

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
  return absolutePath(outputPath || 'dist');
};

export const getLibEnv = (mode?: string) => {
  const config = require(absolutePath('package.json'))['#buildConfig'];

  return {
    mode: getMode(mode || config?.mode),
    libName: getLibName(config.libName),
    cacheDirectory: absolutePath('node_modules/.cache'),
    outputDir: getOutputPath(config.outputPath),
  };
};

export const getPublicPath = (publicPath?: string) => {
  return publicPath || '/';
};

export const createEnvironmentHash = (
  env: ReturnType<typeof getUmdEnv | typeof getUmdLibConfig>
) => {
  const hash = createHash('md5');
  hash.update(JSON.stringify(env));

  return hash.digest('hex');
};

export const getUmdEnv = (mode?: string) => {
  const config = require(absolutePath('package.json'))['#buildConfig'];

  return {
    mode: getMode(mode || config?.mode),
    outputDir: getOutputPath(config?.outputPath),
    publicPath: getPublicPath(config?.publicPath),
    cacheDirectory: absolutePath('node_modules/.cache'),
    swSrc: absolutePath('src/service-worker'),
    env: getEnvConfig(),
  };
};

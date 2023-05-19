/**
 * 配置提取
 *
 * @filename src/constants/index.ts
 * @author Mr Prince
 * @date 2023-05-19 15:46:00
 */

/**
 * 模式
 */
export const mode = 'production';

/**
 * 是否是生产模式
 */
export const isEnvProduction = mode == 'production';

/**
 * bytes
 *
 * 5M
 *
 * 超过5M显示警告
 */
export const WARN_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 是否生成 sourceMap
 */
export const sourceMap = true;

export const chunkFilename = '[content:10]';
export const fileName = '[name]:[content:10]';

/**
 * 最少支持的范围
 */
export const browserslist = '> 0.01%';

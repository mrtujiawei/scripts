/**
 * 打包 UMD lib 使用
 *
 * @filename: scripts/webpack.config.ts
 * @author: Mr Prince
 * @date: 2022-11-02 15:05:44
 */
import webpack from 'webpack';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import { getLibEnv } from '../utils';

const getConfig = (mode?: string) => {
  const env = getLibEnv(mode);
  const isEnvProduction = env.mode == 'production';

  const config: webpack.Configuration = {
    mode: env.mode,
    bail: isEnvProduction,
    devtool: !isEnvProduction && 'source-map',
    stats: 'errors-warnings',
    entry: './src/index',
    output: {
      globalObject: 'this',
      path: env.outputDir,
      filename: `index.${env.mode}.js`,
      library: {
        type: 'umd',
        name: env.libName,
      },
    },
    module: {
      // 将缺失的导出提示成错误而不是警告
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              test: /\.(t|j)sx?$/,
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
                options: {
                  sourceMaps: !isEnvProduction,
                  // 加载源文件本身的sourceMap
                  inputSourceMap: !isEnvProduction,
                  cacheDirectory: true,
                  cacheCompression: false,
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        // 如果用了 @babel/plugin-transform-runtime
                        // 不应该设置 useBuiltIns
                        // useBuiltIns: 'usage',
                        // corejs: '3.30.2',
                      },
                    ],
                    [
                      '@babel/preset-react',
                      {
                        runtime: 'automatic',
                      },
                    ],
                    '@babel/preset-typescript',
                  ],
                  plugins: [
                    [
                      '@babel/plugin-transform-runtime',
                      {
                        corejs: 3,
                        proposals: true,
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      mainFields: ['#source', 'browser', 'module', 'main'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserWebpackPlugin({
          // 注释不单独生成一个文件
          extractComments: false,
          terserOptions: {
            compress: {
              // webpack 默认 配置为2
              // 没必要压缩两遍
              passes: 1,
            },
            mangle: {
              safari10: true,
            },
            output: {
              // 不生成特殊的注释
              comments: false,
            },
          },
        }),
      ],
    },
    performance: {
      maxEntrypointSize: 5 * 1024 * 1024,
      maxAssetSize: 5 * 1024 * 1024,
    },
  };

  return config;
};

export default getConfig;

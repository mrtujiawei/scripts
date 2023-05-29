/**
 * 打包less文件
 * src/component/*.less
 * src/*.less
 * 支持这两种目录使用方式
 */
import { dest, parallel, src, task, watch } from 'gulp';
import less from 'gulp-less';
import path from 'path';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import { Transform } from 'stream';

const entrys = 'src/**/*.less';

const output = 'dist/styles/';

/**
 * 减少一个目录层级
 */
function reduceName(path: rename.ParsedPath): rename.ParsedPath {
  if (path.dirname == '.') {
    return path;
  }
  return {
    dirname: '',
    basename: path.dirname,
    extname: path.extname,
  };
}

/**
 * 转换@import 路径
 * 因为上面的reduceName把所有.less文件放到了同一层级
 * 需要将@import 的路径修改一下
 */
function transformImport() {
  return new Transform({
    objectMode: true,
    transform(file, _encoding, callback) {
      let reg = /@import +['"](.+)\.less['"]/g;
      const content = file.contents
        .toString()
        .replace(reg, (_$0: string, $1: string) => {
          let path = $1;
          if (path.startsWith('..')) {
            path = path.slice(1);
          }
          if (path.endsWith('index')) {
            path = path.slice(0, path.length - '/index'.length);
          }
          return `@import '${path}.less'`;
        });

      file.contents = Buffer.from(content);

      return callback(null, file);
    },
  });
}

/**
 * 直接复制到打包目录
 * 不做任何转换
 */
async function copyLess() {
  return src(entrys)
    .pipe(rename(reduceName))
    .pipe(transformImport())
    .pipe(dest(output));
}

async function buildLess() {
  return src(entrys)
    .pipe(
      less({
        paths: [path.join(__dirname, 'less', 'include')],
      })
    )
    .pipe(postcss([autoprefixer({ grid: 'autoplace' })]))
    .pipe(cleanCss({}))
    .pipe(rename(reduceName))
    .pipe(dest(output));
}

task('start', () =>
  watch(entrys, { ignoreInitial: false }, parallel(buildLess, copyLess))
);

export default parallel(buildLess, copyLess);

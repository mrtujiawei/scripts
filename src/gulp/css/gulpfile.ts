/**
 * 转换css
 */
import { dest, src, task, watch } from 'gulp';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import cleanCss from 'gulp-clean-css';

const entrys = 'src/**/*.css';

const output = 'dist';

async function buildCss() {
  return src(entrys)
    .pipe(postcss([autoprefixer({ grid: 'autoplace' })]))
    .pipe(cleanCss({}))
    .pipe(dest(output));
}

task('start', () => watch(entrys, { ignoreInitial: false }, buildCss));

export default buildCss;

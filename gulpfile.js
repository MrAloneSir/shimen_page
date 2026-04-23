const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const webserver = require('gulp-webserver');

// 复制 common + images 到 dist
function assets() {
  return gulp.src(['src/common/**/*', 'src/images/**/*'], { base: 'src' })
    .pipe(gulp.dest('dist/'));
}

// 编译HTML
function html() {
  return gulp.src('src/*.html')
    .pipe(fileInclude({ prefix: '@@', basepath: '@file', escape: false }))
    .pipe(gulp.dest('dist/'));
}

// 服务 + 热重载
function server() {
  gulp.watch('src/**/*.html', gulp.series(html, assets));
  gulp.watch('src/images/**/*', assets);
  return gulp.src('dist').pipe(webserver({
    livereload: true,
    open: true,
    port: 3000
  }));
}

exports.default = gulp.series(html, assets, server);
exports.build = gulp.series(html, assets);
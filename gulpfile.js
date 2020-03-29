"use strict";
const { watch, series } = require('gulp');
//******************************************************************************
//* DEPENDENCIES
//******************************************************************************
var gulp = require("gulp"),
    // browserify = require("browserify"),
    // tsify = require("tsify"),
    // source = require("vinyl-source-stream"),
    // buffer = require("vinyl-buffer"),
    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),
    // sourcemaps = require("gulp-sourcemaps"),
    // uglify = require("gulp-uglify"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul"),
    browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
// var bundler = require('aurelia-bundler');
// var path = require("path");
// var Builder = require('systemjs-builder');
// var concat = require('gulp-concat');
var header = require('gulp-header');
var SystemJSCacheBuster = require("systemjs-cachebuster");

var dist = "dist/"
var cacheBuster = new SystemJSCacheBuster({ output: dist + "system.cachebuster.json" });
var prod = series(lint, build_ts, test, do_prod, build_static, cache, copy_libs);
exports.default = series(build_ts, do_local, build_static, cache, copy_libs, test, run_app);
exports.qa = series(lint, build_ts, test, do_qa, build_static, cache, copy_libs);
exports.prod = prod;
exports.pack = series(lint, build_ts, test, do_pack, build_static, cache, copy_libs);
exports.mob = series(lint, build_ts, test, do_prod, build_static, cache, copy_mob);
function lint(cb) {
    var config = { extends: "tslint:recommended", formatter: "verbose", emitError: (process.env.CI) ? true : false };

    return gulp.src([
        "src/**/**.ts",
        "test/**/**.test.ts"
    ]).pipe(tslint(config))
        .pipe(tslint.report());
}
//******************************************************************************
//* BUILD TEST
//******************************************************************************
// var tsTestProject = tsc.createProject("tsconfig.json");


function hook(cb) {
    return gulp.src(['src/**/*.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
}
function test(hook, cb) {
    return gulp.src('dist/test/**/*.test.js')
        .pipe(mocha({ ui: 'bdd' }))
        .pipe(istanbul.writeReports());
}

var ts = tsc.createProject("tsconfig.json");
function build_ts() {

    return gulp.src([
        "src/**/**.ts",
        "test/**/*.ts"], { base: "." }
    ).pipe(ts()).pipe(gulp.dest(dist));

    // return gulp.src([
    //     "src/**/**.ts",
    //     "test/**/*.ts"],
    //     { base: "." }
    // ).pipe(ts())
    //     .on("error", function (err) {
    //         process.exit(1);
    //     }).js
    //     .pipe(gulp.dest("."));

}
function build_static(cb) {

    gulp.src(["src/**/*.html"]).pipe(gulp.dest(dist + "src/"));
    gulp.src(["src/**/*.css"]).pipe(gulp.dest(dist + "src/"));
    gulp.src("css/**/*.*").pipe(gulp.dest(dist + "css/"));
    gulp.src(["*.html"]).pipe(gulp.dest(dist));

    cb();
}
function copy_libs(cb) {

    gulp.src("js/**/*.*").pipe(gulp.dest(dist + "js/"));
    gulp.src("img/**/*.*").pipe(gulp.dest(dist + "img/"));

    gulp.src("node_modules/aurelia-fetch-client/dist/**/*.*").pipe(gulp.dest(dist + "/node_modules/aurelia-fetch-client/dist/"));
    gulp.src("node_modules/systemjs/dist/**/*.*").pipe(gulp.dest(dist + "/node_modules/systemjs/dist/"));
    gulp.src("node_modules/systemjs-cachebuster/src/**/*.*").pipe(gulp.dest(dist + "/node_modules/systemjs-cachebuster/src/"));
    gulp.src("node_modules/jquery/dist/**/*.*").pipe(gulp.dest(dist + "/node_modules/jquery/dist/"));
    gulp.src("node_modules/bootstrap/dist/**/*.*").pipe(gulp.dest(dist + "/node_modules/bootstrap/dist/"));
    gulp.src("node_modules/font-awesome/**/*.*").pipe(gulp.dest(dist + "/node_modules/font-awesome/"));
    gulp.src("node_modules/whatwg-fetch/**/*.*").pipe(gulp.dest(dist + "/node_modules/whatwg-fetch/"));
    gulp.src("node_modules/file-saver/**/*.*").pipe(gulp.dest(dist + "/node_modules/file-saver/"));
    gulp.src("node_modules/echarts/dist/**/*.*").pipe(gulp.dest(dist + "node_modules/echarts/dist/"));
    gulp.src("node_modules/teamy-utils/dist/**/*.*").pipe(gulp.dest(dist + "node_modules/teamy-utils/dist/"));
    gulp.src("node_modules/aurelia-script/scripts/**/*.*").pipe(gulp.dest(dist + "/node_modules/aurelia-script/scripts/"));
    gulp.src("node_modules/layui-src/dist/**/*.*").pipe(gulp.dest(dist + "/node_modules/layui-src/dist/"));
    gulp.src("node_modules/xlsx/dist/**/*.*").pipe(gulp.dest(dist + "/node_modules/xlsx/dist/"));
    cb();
}
function copy_mob(cb) {
    let mob_dist = "mob/www/"
    gulp.src("js/**/*.*").pipe(gulp.dest(dist + "js/"));
    gulp.src("img/**/*.*").pipe(gulp.dest(dist + "img/"));

    gulp.src("node_modules/aurelia-fetch-client/dist/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/aurelia-fetch-client/dist/"));
    gulp.src("node_modules/systemjs/dist/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/systemjs/dist/"));
    gulp.src("node_modules/systemjs-cachebuster/src/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/systemjs-cachebuster/src/"));
    gulp.src("node_modules/jquery/dist/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/jquery/dist/"));
    gulp.src("node_modules/weui/dist/style/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/weui/dist/style/"));
    gulp.src("node_modules/bootstrap/dist/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/bootstrap/dist/"));
    gulp.src("node_modules/font-awesome/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/font-awesome/"));
    gulp.src("node_modules/whatwg-fetch/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/whatwg-fetch/"));
    gulp.src("node_modules/materialize-css/dist/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/materialize-css/dist/"));
    gulp.src("node_modules/file-saver/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/file-saver/"));
    gulp.src("node_modules/docxtemplater/**/*.*").pipe(gulp.dest(mob_dist + "node_modules/docxtemplater/"));
    gulp.src("node_modules/weui.js/dist/**/*.*").pipe(gulp.dest(mob_dist + "node_modules/weui.js/dist/"));
    gulp.src("node_modules/teamy-utils/dist/**/*.*").pipe(gulp.dest(mob_dist + "node_modules/teamy-utils/dist/"));
    gulp.src("node_modules/aurelia-script/scripts/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/aurelia-script/scripts/"));
    gulp.src("node_modules/vconsole/dist/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/vconsole/dist/"));
    gulp.src("node_modules/layui-src/dist/**/*.*").pipe(gulp.dest(mob_dist + "/node_modules/layui-src/dist/"));
    gulp.src(dist + "**/*.*").pipe(gulp.dest("mob/www/"));
    gulp.src("app/**/*.*").pipe(gulp.dest("mob/www/", { overwrite: true }));
    cb();
}

function run_app(cb) {
    browserSync.init({
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });

    watch(["src/**/**.ts", "test/**/*.ts"], series(build_ts, cache, reload));
    //gulp.watch("dist/*.js").on('change', browserSync.reload);
    gulp.watch(['*.html', 'src/**/*.html', 'src/**/*.css', 'css/**/*.css'], series(build_static, cache, reload));

    gulp.watch(['img/**/*', 'js/**/*'], series(copy_libs, cache, reload));
    // gulp.watch(['src/**/*.js'], browserSync.reload);
    cb();
}
function reload(cb) {
    console.log("reload....");

    browserSync.reload();
    //browserSync.reload();
    cb();
    console.log("reloaded...");
}
function cache() {
    return gulp.src(["src/**/*.html", dist + 'src/**/*.js']).pipe(cacheBuster.full()).pipe(cacheBuster.incremental()).pipe(gulp.dest(dist));

}
function cache_js() {
    return gulp.src(["src/**/*.html", dist + 'src/**/*.js']).pipe(cacheBuster.full()).pipe(cacheBuster.incremental()).pipe(gulp.dest(dist));

}
function cache_html() {
    return gulp.src(["src/**/*.html", 'src/**/*.js']).pipe(cacheBuster.full()).pipe(cacheBuster.incremental()).pipe(gulp.dest(dist));

}
function do_local(cb) {
    gulp.src(['config.js']).pipe(gulp.dest(dist));
    cb();
}
function do_qa(cb) {
    gulp.src(['config.js']).pipe(header('var teamy_profile="qa";\n')).pipe(gulp.dest("dist/"));
    cb();
}
function do_prod(cb) {
    gulp.src(['config.js']).pipe(header('var teamy_profile="production";\n')).pipe(gulp.dest("dist/"));
    cb();
}
function do_pack(cb) {
    let dist = "dist/"
    gulp.src(['config.js']).pipe(header('var teamy_profile="production";\n')).pipe(gulp.dest("dist/"));
    gulp.src("package-prod.json").pipe(rename('package.json')).pipe(gulp.dest(dist))
    gulp.src("app.js").pipe(gulp.dest(dist))
    cb();
}

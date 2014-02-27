/*

    wtf is this?

        edit source/helios-preloader.js using gulp watch.
        It'll auto-compile into standalone and angular versions.

*/

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    fs = require('fs');

var content = function(){
    return fs.readFileSync('source/helios-preloader.js', 'utf8');
}

gulp.task('build', function(){
    return gulp.src(['source/wrapper.standalone.js'])
        .pipe(replace('%%% REPLACE %%%', content() ))
        .pipe(rename({ basename: 'helios-preloader' }))
        .pipe(gulp.dest('.'))
        .pipe(uglify({ mangle: false }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('.'))
})

gulp.task('build-ng', function(){
    return gulp.src(['source/wrapper.angular.js'])
        .pipe(replace('%%% REPLACE %%%', content() ))
        .pipe(rename({
            basename: 'helios-preloader.angular'
        }))
        .pipe(gulp.dest('.'))
})

gulp.task('build-require', function(){
    return gulp.src(['source/wrapper.require.js'])
        .pipe(replace('%%% REPLACE %%%', content() ))
        .pipe(rename({
            basename: 'helios-preloader.require'
        }))
        .pipe(gulp.dest('.'))
        .pipe(uglify({ mangle: false }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('.'))
})


gulp.task('default', ['build', 'build-ng', 'build-require', 'watch']);

gulp.task('watch',function(){

    gulp.watch('source/helios-preloader.js', ['build', 'build-ng', 'build-require']);

})
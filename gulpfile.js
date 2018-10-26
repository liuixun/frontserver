const gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
    sourcemaps = require('gulp-sourcemaps');
    less = require('gulp-less');


gulp.task('watch', function () {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});

gulp.task('watch', function () {

    //Watch .css files
    gulp.watch('src/styles/**/*.css', ['styles-css']);

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles-sass']);

    //Watch .less files
    gulp.watch('src/styles/**/*.less', ['styles-less']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

});

gulp.task('styles-css', function () {
    gulp.src('src/styles/**/*.css')
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(notify({ message: 'Styles-css task complete' }));
});

gulp.task('styles-sass', function () {
    return sass('src/styles/**/*.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(sourcemaps.init())
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(notify({ message: 'Styles-sass task complete' }));
});

gulp.task('styles-Less', function () {
    gulp.src('src/styles/**/*.less')
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(notify({ message: 'Styles-less task complete' }));;
});

gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images/img'))
        .pipe(notify({ message: 'Images task complete' }));
});


gulp.task('clean', function () {
    return del(['dist/styles/css', 'dist/scripts/js', 'dist/images/img']);
});

gulp.task('default', ['clean'], function () {
    gulp.start('styles-css', 'styles-sass', 'styles-less', 'scripts', 'images');
});




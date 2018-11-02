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
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    htmlmin = require('gulp-htmlmin'),
    webserver = require('gulp-webserver'),
    tinylr = require('tiny-lr'),
    browerSync = require('browser-sync'),
    server = tinylr();
    // gulp.task('webserver', function() {
    //     gulp.src('./')
    //       .pipe(webserver({
    //         livereload: true,
    //         directoryListing: true,
    //         open: true
    //   }))
    // });
   
    gulp.task('webserver',function(){
        browerSync({
            server:{
                baseDir:['./']
            },
            port: 8080
        },function(err,bs){
             console.log(bs.options.getIn(["urls", "local"]));
        });
    
    });

gulp.task('watch', ()=>{
    gulp.watch('**/*.html', ['htmlmin']);

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

})


gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/html/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'))
        .pipe(browerSync.reload({
            stream: true
        }))
});


gulp.task('styles-css', function () {
    gulp.src('src/styles/**/*.css')
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(notify({ message: 'Styles-css task complete' }))
        .pipe(browerSync.reload({
            stream: true
        }));
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
        .pipe(notify({ message: 'Styles-sass task complete' }))
        .pipe(browerSync.reload({
            stream: true
        }));
});

gulp.task('styles-less', function () {
    gulp.src('src/styles/**/*.less')
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/styles/css'))
        .pipe(notify({ message: 'Styles-less task complete' }))
        .pipe(browerSync.reload({
            stream: true
        }));
});

gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint({
            'undef': true,
            'unused': true
        }))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts/js'))
        .pipe(notify({ message: 'Scripts task complete' }))
        .pipe(browerSync.reload({
            stream: true
        }));
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images/img'))
        .pipe(notify({ message: 'Images task complete' }))
        .pipe(browerSync.reload({
            stream: true
        }));
});


gulp.task('clean', function () {
    return del(['dist/html', 'dist/styles/css', 'dist/scripts/js', 'dist/images/img']);
});

gulp.task('default', ['clean','webserver', 'watch'], function () {
    gulp.start('htmlmin', 'styles-css', 'styles-sass', 'styles-less', 'scripts', 'images');
});



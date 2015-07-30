
var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    mainBowerFiles = require('main-bower-files'),
    gulpFilter   = require('gulp-filter'),
    del = require('del'),
    order = require("gulp-order"),
    inject = require('gulp-inject');


gulp.task('clean', function (callback) {
    del(['tmp/**/*.*'], callback);
});

gulp.task('bower', ['clean'], function() {
    var bowerOptions = {
        debugging: false,
        overrides: {
            'jquery': {
                ignore: true
            }
        }
    };

    var jsFilter = gulpFilter('*.js'),
        cssFilter = gulpFilter('*.css'),
        fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']),
        imageFilter = gulpFilter(['*.gif', '*.png', '*.svg', '*.jpg', '*.jpeg']);


    return gulp.src(mainBowerFiles(bowerOptions))
        // JS
        .pipe(jsFilter)
        .pipe(gulp.dest('./tmp/lib/js'))
        .pipe(jsFilter.restore())

        // CSS
        .pipe(cssFilter)
        .pipe(gulp.dest('./tmp/lib/css'))
        .pipe(cssFilter.restore())

        // FONTS
        .pipe(fontFilter)
        .pipe(gulp.dest('./tmp/lib/fonts'))
        .pipe(fontFilter.restore())

        // IMAGES
        .pipe(imageFilter)
        .pipe(gulp.dest('./tmp/lib/images'))
        .pipe(imageFilter.restore())
});


gulp.task('inject', ['bower'], function() {

    var target = gulp.src('./src/index.html');
    var sources = gulp.src([
        './tmp/lib/css/*.css',
        './tmp/lib/js/*.js'
    ], {read: false})
        .pipe(order([
            "jquery.js",
            "angular.js"
        ]));

    var injectOptions = {
        name: 'lib',
        ignorePath: 'tmp',
        addRootSlash: false
    };

    return target
        .pipe(inject(sources,injectOptions))
        .pipe(gulp.dest('./tmp'));
});

gulp.task('build', ['inject']);


gulp.task('webserver', ['build'], function() {
    var webserverOptions = {
        livereload: true
    }

    return gulp.src('./tmp')
        .pipe(webserver(webserverOptions));
});

gulp.task('default', ['webserver']);
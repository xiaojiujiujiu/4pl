/**
 * Created by xuwusheng on 16/3/22.
 */
var gulp = require('gulp'),
    connect = require('gulp-connect');
    jshint = require('gulp-jshint'), //代码检查
    minifycss = require('gulp-minify-css'), //css压缩
    clean = require('gulp-clean'), //清除文件
    imagemin = require('gulp-imagemin'), //图片压缩
    uglify = require('gulp-uglify'), //js压缩
    openURL = require('open');

var app={
    scriptPath:'js/**/**/*.js',
    cssPath:'css/*.css',
    viewPath:'views/**/**/*.html'
};
//压缩js文件夹下脚本任务
gulp.task('script', function () {
    //需要压缩的文件
    gulp.src(app.scriptPath)
        //检查代码
        .pipe(jshint())
        //压缩
        .pipe(uglify())
        //压缩后位置
        .pipe(gulp.dest('dist/js'));
});
//压缩打印文件夹任务
gulp.task('print', function () {
    gulp.src('print/js/*.js')
        .pipe(jshint())
        .pipe(uglify())
        .pipe(gulp.dest('dist/print/js'));
    gulp.src('print/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist/print'));
    gulp.src('print/*.html')
        .pipe(gulp.dest('dist/print'));
});
//压缩css任务
gulp.task('css', function () {
    gulp.src(app.cssPath)
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});
//压缩lib任务
gulp.task('lib', function () {
    gulp.src('lib/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/lib'))
});
//复制文件
gulp.task('copy', function () {
    //复制views
   gulp.src(app.viewPath)
       .pipe(gulp.dest('dist/views'));
    //复制fonts
    gulp.src('fonts/*')
        .pipe(gulp.dest('dist/fonts'));
    //复制index
    gulp.src('index.html')
       .pipe(gulp.dest('dist'));
});
//图片压缩
gulp.task('imagemin', function () {
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});
//清除文件
gulp.task('clean', function () {
    gulp.src(['dist'],{read:false})
        .pipe(clean());
});
//启动浏览器
gulp.task('start:client', ['start:server'], function () {
    openURL('http://localhost:8080','/Applications/Google Chrome.app');
});
//启动服务
gulp.task('start:server', function() {
    connect.server({
        root: '../www',
        livereload: true,
        // Change this to '0.0.0.0' to access the server from outside.
        port: 8080
    });
    gulp.watch(app.scriptPath, function () {
        gulp.src(app.scriptPath)
            .pipe(connect.reload());
    });
    gulp.watch(app.cssPath, function () {
        gulp.src(app.cssPath)
            .pipe(connect.reload());
    });
    gulp.watch(app.viewPath, function () {
        gulp.src(app.viewPath)
            .pipe(connect.reload());
    });
    gulp.watch('index.html', function () {
        gulp.src('index.html')
            .pipe(connect.reload());
    });
});
//自动检测任务
gulp.task('auto', function () {

    gulp.watch(app.scriptPath,['script']);
    gulp.watch(app.viewPath,['copy']);
    gulp.watch(app.cssPath,['css']);
});

//默认任务
gulp.task('default', ['lib','script','css','print','imagemin','copy','auto']);
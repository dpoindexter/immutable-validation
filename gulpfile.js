var gulp = require('gulp'),
    babel = require('gulp-babel');

gulp('transpile', function () {
    return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});
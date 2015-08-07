var gulp = require('gulp'),
    babel = require('gulp-babel'),
    file = require('gulp-file'),
    rollup = require('rollup');

var exportName = 'ImmutableValidation';

gulp.task('build', function (done) {
    rollup.rollup({
        entry: 'src/validation.js',
        external: [ 'immutable', 'react' ]
    }).then(function (bundle) {
        var res;
        try {
            res = bundle.generate({
                format: 'umd',
                moduleName: exportName,
                globals: {
                    immutable: 'Immutable',
                    react: 'React'
                }
            });
        } catch (e) {
            console.log('Err: ', e.message);
        }

        console.log('Bundle OK');

        file(exportName + '.js', res.code, { src: true })
            .pipe(babel({
                blacklist: ['useStrict']
            }))
            .pipe(gulp.dest('dist'))
            .on('end', done);
    });
});
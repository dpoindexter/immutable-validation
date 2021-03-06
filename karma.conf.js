// Karma configuration
// Generated on Mon Aug 17 2015 12:16:46 GMT-0500 (Central Daylight Time)
/*eslint-env node*/
/*eslint no-var: 0, indent: [1, 2], space-before-function-paren: 0*/
var path = require('path');
var isparta = require('isparta');

var isCi = process.env.CONTINUOUS_INTEGRATION === 'true';
var runCoverage = process.env.COVERAGE === 'true' || isCi;

var coverageLoaders = [];
var coverageReporters = [];

if (runCoverage) {
  coverageLoaders.push({
    test: /\.js$/,
    include: path.resolve('src/'),
    exclude: /tests/,
    loader: 'isparta'
  });

  coverageReporters.push('coverage');
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'installImmutableDevtools.js',
      'tests/**/*spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'installImmutableDevtools.js': ['webpack'],
      'src/**/*.js': ['webpack', 'sourcemap'],
      'tests/**/*.js': ['webpack', 'sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'].concat(coverageReporters),

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
              path.resolve(__dirname, './installImmutableDevtools.js'),
              path.resolve(__dirname, './src'),
              path.resolve(__dirname, './tests')
            ]
          }
        ].concat(coverageLoaders)
      }
    },

    webpackServer: {
      noInfo: true
    },

    coverageReporter: {
      // instrumenters: { isparta: isparta },
      // instrumenter: {
      //   '**/*.js': 'isparta'
      // },
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' }
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

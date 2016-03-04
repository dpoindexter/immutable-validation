var path = require('path');
var webpack = require('webpack');

module.exports = {

    output: {
        library: 'ImmutableValidation',
        libraryTarget: 'umd'
    },

    externals: [{
        'immutable': {
            root: 'Immutable',
            commonjs2: 'immutable',
            commonjs: 'immutable',
            amd: 'immutable'
        }
    }],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, './src')
                ]
            }
        ]
    },

    node: {
        Buffer: false
    }

};
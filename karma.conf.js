const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const currentTestFiles = `${process.cwd()}/test/*.spec.ts`;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: ['karma-webpack', 'karma-jasmine', 'karma-chrome-launcher'],
    files: [currentTestFiles],
    preprocessors: {
      [currentTestFiles]: ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
          fs: require.resolve('fs-web'),
        },
      },
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
      },
      module: {
        rules: [{ test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules|dist/ }],
      },
      plugins: [
        new NodePolyfillPlugin({
          excludeAliases: ['console'],
        }),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('browser'),
          },
        }),
      ],
    },
    port: 9876,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    concurrency: Infinity,
  });
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
import type { Configuration } from 'webpack';
import * as webpack from 'webpack';
import {} from 'webpack-dev-server';
// required for Configuration interface merging(devServer property), see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/43232

const mode = (process.env.ENV as Configuration['mode']) || 'development';

const config: Configuration = {
  mode,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  entry: './src/main.tsx',
  output: {
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[name][ext]',
    path: path.resolve(__dirname, 'build'),
    publicPath: mode === 'development' ? '/' : 'auto',
  },
  infrastructureLogging: {
    level: 'log',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'SWapi',
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    open: true,
    port: 3002,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'build'),
    },
  },
};

module.exports = config;

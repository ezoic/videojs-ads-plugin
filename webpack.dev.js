const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const buildProps = require('./webpack.properties.js');

const WEBPACK_MODE = buildProps.MODE_DEVELOPMENT;

const commonConfig = require('./webpack.common.js')(WEBPACK_MODE);

module.exports = merge(commonConfig, {
  mode: WEBPACK_MODE,
  entry: buildProps.plugin.entry_file,
  devtool: buildProps.devTool[WEBPACK_MODE],
  output: {
    path: buildProps.output.path,
    filename: buildProps.plugin.output_file[WEBPACK_MODE],
    libraryTarget: buildProps.plugin.libraryTarget,
    library: buildProps.plugin.var_name
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin()
  ]
});
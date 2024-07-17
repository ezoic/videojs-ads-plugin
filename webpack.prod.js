const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const buildProps = require('./webpack.properties.js');

const WEBPACK_MODE = buildProps.MODE_PRODUCTION;

const commonConfig = require('./webpack.common.js')(WEBPACK_MODE);

module.exports = (env, argv) => {
    const prodConfig = merge(commonConfig, {
        mode: WEBPACK_MODE,
        entry: buildProps.plugin.entry_file,
        devtool: false, // Disable source maps for production
        output: {
            path: buildProps.output.path,
            filename: buildProps.plugin.output_file[WEBPACK_MODE],
            libraryTarget: buildProps.plugin.libraryTarget,
            library: buildProps.plugin.var_name,
            asyncChunks: false,
        },
        plugins: [
            new CleanWebpackPlugin(),
            new ESLintPlugin({
                emitWarning: true,
                failOnError: false,
                failOnWarning: false
            })
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
            ],
            splitChunks: false,
            runtimeChunk: false,
        }
    });

    return prodConfig;
};
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const buildProps = require('./webpack.properties.js');

const WEBPACK_MODE = buildProps.MODE_DEVELOPMENT;

const commonConfig = require('./webpack.common.js')(WEBPACK_MODE);

module.exports = function (env, argv) {
    const cleanConfig = {
        plugins: [
            new CleanWebpackPlugin()
        ]
    };

    const pluginConfig = {
        mode: WEBPACK_MODE,
        entry: buildProps.plugin.entry_file,
        devtool: buildProps.devTool[WEBPACK_MODE],
        output: {
            path: buildProps.output.path,
            filename: buildProps.plugin.output_file[WEBPACK_MODE],
            libraryTarget: buildProps.plugin.libraryTarget,
            library: buildProps.plugin.var_name
        }
    };

    return [merge(pluginConfig, commonConfig, cleanConfig)];
};
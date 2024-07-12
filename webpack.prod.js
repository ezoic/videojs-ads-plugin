var merge = require('webpack-merge');

var buildProps = require('./webpack.properties.js');

var WEBPACK_MODE = buildProps.MODE_PRODUCTION;

var devConfig = require('./webpack.dev.js');
var commonConfig = require('./webpack.common.js')(WEBPACK_MODE);

module.exports = function (env, argv) {

    devConfig = devConfig(env, argv);

    var pluginConfig = {
        mode: WEBPACK_MODE,
        entry: buildProps.plugin.entry_file,
        devtool: buildProps.devTool[WEBPACK_MODE],
        output: {
            path: buildProps.output.path,
            filename: buildProps.plugin.output_file[WEBPACK_MODE],
            libraryTarget: buildProps.plugin.libraryTarget,
            library: buildProps.plugin.var_name
        },
        module: {
            rules: [{
                test: /\.js$/,
                enforce: 'pre',
                exclude: /(node_modules|test)/,
                use: [{
                    loader: 'webpack-strip-block',
                    options: {
                        start: 'PROD-EXCLUDE-START',   // Format: /* BUILD-EXCLUDE-START */ -- Beginning of code block to exclude from the build
                        end: 'PROD-EXCLUDE-END'        // Format: /* BUILD-EXCLUDE-END */   -- End of code block to exclude from the build
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                  {
                    loader: 'eslint-loader',
                    options: {
                      emitWarning: true,
                      failOnError: false,
                      failOnWarning: false
                    }
                  }
                ]
              }]
        }
    };

    pluginConfig = merge(pluginConfig, commonConfig);

    return devConfig.concat([pluginConfig]);
};

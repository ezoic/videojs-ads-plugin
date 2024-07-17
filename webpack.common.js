const webpack = require('webpack');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const buildProps = require('./webpack.properties.js');

const bannerOptions = {
    banner: buildProps.plugin.bannerText,
    entryOnly: true,
    raw: false
};

module.exports = function (mode) {
    console.log('Exporting Common Config > mode: ' + mode);

    const config = {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [
                        path.resolve(__dirname, 'src')
                    ],
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                                plugins: [
                                    // Custom Babel plugin to replace strings
                                    function () {
                                        return {
                                            visitor: {
                                                StringLiteral(path) {
                                                    // Replace </script> with <\/script>
                                                    if (path.node.value.includes('</script>')) {
                                                        console.warn('*******************************************************************************************');
                                                        console.warn('*** WARNING: "<\/script>" string found in code - THIS SHOULD BE ESCAPED to: "<\\/script>" ***');
                                                        console.warn('*******************************************************************************************');
                                                        path.node.value = path.node.value.replace(/<\/script>/gi, '<\\/script>');
                                                    }
                                                },
                                                DebuggerStatement(path) {
                                                    // Remove debugger statements in production mode
                                                    if (mode === buildProps.MODE_PRODUCTION) {
                                                        path.remove();
                                                    } else {
                                                        console.warn('********************************************************************************');
                                                        console.warn('*** DEV WARNING: debugger; statement found in code - DO NOT COMMIT THIS CODE ***');
                                                        console.warn('********************************************************************************');
                                                    }
                                                }
                                            }
                                        };
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new ESLintPlugin({
                context: path.resolve(__dirname, 'src'),
                emitError: true,
                failOnError: true,
            }),
            new webpack.BannerPlugin(bannerOptions)
        ]
    };

    return config;
};
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
// {
//                 from: /\~ViteJS.version/,
//                 to: version
//             }

module.exports = {
    mode:'production',
    output: {
        path: path.join(__dirname, '../ViteJS')
    },
    optimization: {
        splitChunks:{
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: false
            })
        ]
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
};

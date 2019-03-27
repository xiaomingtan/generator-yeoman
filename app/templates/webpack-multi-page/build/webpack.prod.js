process.env.NODE_ENV = 'production'
const baseWebpackConfig = require('./webpack.base.conf')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const i18n = require("./i18n")
const zh = require("../src/language/zh-cn")
const ja = require("../src/language/ja")
const en = require("../src/language/en-us")
const fs = require('fs')
const webpack = require('webpack');

var plugins = [
    new CleanWebpackPlugin(
        ['dist'],　 //匹配删除的文件
        {
            root: path.resolve(__dirname,'../'),     //根目录
            verbose: true,                                 //是否启用控制台输出信息
            dry: false,                                   //设置为false,启用删除文件
        }),
    // extract css into its own file
    new ExtractTextPlugin({
        filename: "css/[name].[chunkHash].css",
        allChunks: true,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new OptimizeCSSPlugin({
        cssProcessorOptions: {safe: true}
    }),
]

const templateFiles = fs.readdirSync(path.join(__dirname, '../src/template'))
templateFiles.forEach(function (item, index) {
    plugins.push(
        new HtmlWebpackPlugin({
            inject: 'head',
            filename: item,
            template: `./src/template/${item}`,
            chunks: [item.split('.')[0], 'commons', 'vendor'],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
           favicon: "./favicon.ico"
        }),)
})

// plugins.push(
//     new webpack.DllReferencePlugin({
//         context: __dirname,
//         manifest: require('../static/dll/vendor-mainfest.json') // 指向生成的json文件
//     })
// )

plugins.push(
    // copy custom static assets
    new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, '../static'),
            to: path.resolve(__dirname, '../dist/static'),
            ignore: ['.*']
        }
    ]),
    new i18n({
        language: {
            zh,
            ja,
            en
        }
    })
)

if (process.env.npm_config_report) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    plugins.push(new BundleAnalyzerPlugin())
}



module.exports = merge(baseWebpackConfig, {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name]-[chunkHash].js',
        publicPath: "/"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "initial",
                    test:  /node_modules[\\\/]|src[\\\/]lib[\\\/]/,
                    name: "vendor",
                    priority: 10,
                    minChunks: 2,
                    enforce: true,
                },
                commons: {
                    chunks: "initial",
                    test:  /src[\\\/]utils[\\\/]|src[\\\/]static[\\\/]/,
                    name: "commons",
                    priority: 2,
                    minChunks: 2,
                    enforce: true
                }
            }
        }
    },
    plugins
})
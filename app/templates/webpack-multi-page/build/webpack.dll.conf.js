//webpack.dll.conf.js
// process.env.NODE_ENV = 'production'
const path = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
//vue项目默认有一个static目录.我就把导出目录放在了static/dll/目录下
const srcPath = path.join(__dirname, '../static/dll/');
//需要编译的模块
const vendors = [
    'jquery',
    'i18next',
    // './node_modules/bootstrap/dist/css/bootstrap-grid.min.css'
];


webpackConfig = {
    entry: {
        vendor: vendors
    },
    module: {
        rules: [
            {
                test: /\.styl$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                },{
                    loader: "stylus-loader"
                }]
            },
            {test: /\.css/, use: ["style-loader", "css-loader"]},
            {test: /\.js/, use: ["babel-loader"], exclude: /(node_modules)/},
            {
                test:/\.(png)|(jpg)|(gif)|(woff)|(svg)|(eot)|(ttf)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,   //小于10K的 都打包
                            name:"images/[hash:8].[name].[ext]",
                        }
                    }
                ]
            },
        ]
    },
    output: {
        path: srcPath, // 输出的路径
        filename: '[name].dll.js', // 输出的文件，将会根据entry命名为vendor.dll.js
        library: '[name]_library' // 暴露出的全局变量名
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].dll.css'
        }),
        new webpack.DllPlugin({
            path: path.join(srcPath, '[name]-mainfest.json'), // 描述依赖对应关系的json文件
            name: '[name]_library',
            context: __dirname // 执行的上下文环境，对之后DllReferencePlugin有用
        })
    ]
}

if (process.env.npm_config_report) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
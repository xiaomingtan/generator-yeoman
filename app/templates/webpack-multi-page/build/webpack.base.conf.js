const path = require('path');
const fs = require('fs')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
var entry = {}

const entryFiles = fs.readdirSync(path.join(__dirname, '../src/entry'))
entryFiles.forEach(function (item, index) {
    let [fileName] = item.split('.')
    entry[fileName] = `./src/entry/${item}`
})

module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
        publicPath: "/"
    },
    resolve: {
        extensions: ['.js', '.css', '.json', '.styl'],
        alias: {
            "@src": path.resolve("src"),
            "@static": path.resolve("src/static"),
            "@lib": path.resolve("src/lib"),
            "@utils": path.resolve("src/utils"),
        },
    },
    module: {
        rules: [
            {
                test: /\.styl$/,
                use: process.env.NODE_ENV === 'production' ? ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "stylus-loader"]
                }): ["style-loader", "css-loader", "stylus-loader"]
            },
            {
                test: /\.css$/,
                use:  process.env.NODE_ENV === 'production' ? ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }) : ["style-loader", "css-loader"]
            },
            {
                test: /\.js/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true
                        }
                    }],
                exclude: /(node_modules)/,
            },
            {
                test: /\.(png)|(jpg)|(gif)|(woff)|(svg)|(eot)|(ttf)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,   //小于10K的 都打包
                            name: "images/[hash:8].[name].[ext]",
                        }
                    }
                ]
            },
        ]
    }
};
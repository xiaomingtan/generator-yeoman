const baseWebpackConfig = require('./webpack.base.conf')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs')
const templateFiles = fs.readdirSync(path.join(__dirname, '../src/template'))
const i18n = require("./i18n")
const zh = require("../src/language/zh-cn")
const ja = require("../src/language/ja")
const en = require("../src/language/en-us")
var plugins = []

process.env.NODE_ENV = 'development'

templateFiles.forEach(function (item, index) {
    plugins.push(
        new HtmlWebpackPlugin({
            filename: item,
            template: `./src/template/${item}`,
            chunks: [item.split('.')[0]],
            minify: false,
            favicon: "./favicon.ico"
        }),)
})

plugins.push(
    new i18n({
        language: {
            zh,
            ja,
            en
        }
    })
)

module.exports = merge(baseWebpackConfig, {
    devServer: {
        contentBase: path.join(__dirname, '../'),
        port: 7000,
        host: '0.0.0.0',
    },
    plugins: plugins
})
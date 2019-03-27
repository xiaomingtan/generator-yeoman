function i18nPlugin(options) {
    // 使用 options 设置插件实例……
    this.options = options
}

i18nPlugin.prototype.apply = function(compiler) {
    compiler.hooks.emit.tapAsync('i18n', (compilation, callback) => {
        Object.keys(compilation.assets).forEach(name => {
            if (name.indexOf(".html") !== -1) {
                let source = compilation.assets[name].source()
                source = source.replace(/\$\{path\-zh\}/, `/${name}`)
                source = source.replace(/\$\{path\-ja\}/, `/ja/${name}`)
                source = source.replace(/\$\{path\-en\}/, `/en/${name}`)
                let zhSource = render(source, this.options.language.zh)
                zhSource = setGolgalVar({lang: 'zh'}) + zhSource
                let enSource = render(source, this.options.language.en)
                enSource = setGolgalVar({lang: 'en'}) + enSource
                let jaSource = render(source, this.options.language.ja)
                jaSource = setGolgalVar({lang: 'ja'}) + jaSource

                compilation.assets[name] = {
                    source: () => zhSource,
                    size: () => zhSource.length
                }

                compilation.assets[`en/${name}`] = {
                    source: () => enSource,
                    size: () => enSource.length
                }
                compilation.assets[`ja/${name}`] = {
                    source: () => jaSource,
                    size: () => jaSource.length
                }
            }

        })
    callback()
    });


};

function setGolgalVar(vars) {
    let content = "<script>"
    for (let key in vars) {
        content += `${key}='${vars[key]}';`
    }
    content += "</script>"
    return content
}

function render(template, data) {
    let str = template.replace(/\{\{(.+?)\}\}/g, ($1, $2) => {
        let keys = $2.trim().split(".")
        let keyStr = ""
        for (let i in keys) {
            keyStr += `['${keys[i]}']`
        }
        return eval('data' + keyStr)
    })

    str = str.replace(/my\-placeholder=\"(.+?)\"/g, ($1, $2) => {
        let keys = $2.trim().split(".")
        let keyStr = ""
        for (let i in keys) {
            keyStr += `['${keys[i]}']`
        }
        return `placeholder="${eval('data' + keyStr)}"`
    })

    return str

}

module.exports = i18nPlugin;
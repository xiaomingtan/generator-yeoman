var Generator = require('yeoman-generator');
var path = require("path")
var fs = require("fs")
var mkdirp = require('mkdirp');

function checkDirExist(path) {
    try {
        return fs.statSync(path).isDirectory();
    }
    catch (e) {

        if (e.code == 'ENOENT') { // no such file or directory. File really does not exist
            console.log("File does not exist.");
            return false;
        }

        console.log("Exception fs.statSync (" + path + "): " + e);
        throw e; // something else went wrong, we don't have rights, ...
    }
}

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag

    }
    async prompting() {
        this.answers = await this.prompt([
            {
                name: 'template',
                type: 'list',
                message: 'Select template:',
                choices: [
                    {
                        name: 'Webpack Multiple Page',
                        value: 'webpack-multi-page',
                        checked: true   // 默认选中
                    }
                ]
            },
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname, // Default to current folder name,
                store: true // the user answered previously and use that answer as the new default
            },
            {
                type: "input",
                name: "version",
                message: "Your project version",
                default: "1.0.0"
            },
            {
                type: "input",
                name: "author",
                message: "Your project author",
                default: "xiaomingtan"
            }

        ]);
    }

    writing() {
        let packageJSONPath = path.join(this.templatePath(this.answers.template), "package.json")
        let packageJSON = this.fs.readJSON(packageJSONPath, {});
        packageJSON.name = this.answers.name
        packageJSON.version = this.answers.version
        packageJSON.author = this.answers.author
        this.fs.writeJSON(packageJSONPath, packageJSON)

        if (checkDirExist(path.join(this.destinationPath('./'), "src"))) {
            console.log("Template exists")
            process.exit(1)
        }

        // handle empty directory
        mkdirp.sync("src/component");
        mkdirp.sync("src/entry");
        mkdirp.sync("src/language");
        mkdirp.sync("src/static/css");
        mkdirp.sync("src/static/images");
        mkdirp.sync("src/static/js");
        mkdirp.sync("src/utils");
        mkdirp.sync("src/template");

        this.fs.copyTpl(
            this.templatePath(this.answers.template),
            this.destinationPath('./'),
            { title: 'Templates File'}
        )

        this.fs.copy(
            path.join(this.templatePath(this.answers.template), ".gitignore"),
            this.destinationPath('.gitignore')
        )
    }
};
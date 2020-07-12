const fs = require("fs");
const jsxGenerator = require("svg-to-jsx");

class Component {
    constructor(directories, colors, sizes) {
        this.directories = directories;
        this.colors = colors;
        this.sizes = sizes;
    }

    generateComponents() {
        const response = this.directories.map(dir => {
            const result = this.generateComponent(dir);
            if (result) {
                return result;
            }
        });

        return Promise.all(response);
    }

    async generateComponent(directory) {
        try {
            const path = directory.substr(0, directory.lastIndexOf('/'));
            const name = directory.replace(path + "/", "").replace(".svg", "").replace(/[\W_]+/g, " ");
            const componentName = name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
            const componentPath = path + "/" + componentName + ".jsx";
            const rawJsx = await this._generateJSXfromSVG(directory);
            const processedJsx = this._processJSX(rawJsx, componentName);
            this._generateJSXfile(componentPath, componentName, processedJsx);
            return componentPath;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async _generateJSXfromSVG(path) {
        try {
            const file = fs.readFileSync(path);
            return await jsxGenerator(file);
        } catch (error) {
            return null;
        }
    };

    _generateJSXfile(path, componentName, processedJsx) {
        return fs.writeFileSync(path, this._makeJSXcomponent(componentName, processedJsx));
    }

    _processJSX(rawJsx, componentName) {
        var text = rawJsx;
        /*
        text = text.replace(/<.*? /s, (match) => {
            return match + "{...props} ";
        });
        */

        console.log("COMPONENT -", componentName);
        console.log(" Title: ");
        const titleArr = componentName.split(/(?=[A-Z])/);
        const title = titleArr.join(" ");
        text = text.replace(/<title>.*?<\/title>/g, `<title>${title}</title>`);
        console.log("  Name -", title);

        const titleId = titleArr.join("-").toLowerCase();
        console.log("  Id -", titleId);
        let idNum = {};
        let urlIds = [];

        text = text.replace(/id=".*?"/g, (match) => {
            let oldNum = match.split(`"`);
            let value = oldNum[1].match(/\w+/s)[0].toLowerCase();
            //urlIds.push(`url(#${oldNum[1]})`);
            idNum[value] ? idNum[value]++ : idNum[value] = 1;

            urlIds.push({
                old: `url(#${oldNum[1]})`,
                new: `url(#${value}-${titleId}-${idNum[value]})`
            });

            return `id="${value}-${titleId}-${idNum[value]}"`;
        });

        urlIds.forEach(id => {
            text = text.replace(id.old, id.new);
        });


        console.log(" Sizes: ");
        const sizes = this.sizes.split("x");

        text = text.replace(/width=".*?"/s, `width={ props.width ? props.width + "px" : "${sizes[0]}px" }`);
        console.log("  Width -", sizes[0]);
        text = text.replace(/height=".*?"/s, `height={ props.height ? props.height + "px" : "${sizes[1]}px"}`);
        console.log("  Height -", sizes[1]);

        console.log(" Colors: ");
        let num = 0;

        text = text.replace(/fill=".*?"/g, (match) => {
            let value = match.split(`"`)[1];
            const defaultColor = this.colors[num] ? this.colors[num] === "default" ? value : this.colors[num] : value;
            const str = `fill={ props.colors && typeof props.colors[${num}] !== "undefined" ? props.colors[${num}] : "${defaultColor}" }`;
            console.log("  Color replacement -", num, "-", defaultColor);
            num++;
            return str;
        });

        return text;
    }

    _makeJSXcomponent(componentName, processedJsx) {
        const tab = `    `;
        const importLine = `import React from "react";`;
        const declareLine = `const ${componentName} = (props) => {`;
        const returnLine = `${tab}return (`
        const content = processedJsx.split("\n").map(line => tab + tab + line).join("\n");
        const endReturnLine = `${tab});`
        const declareEndLine = `};`
        const exportLine = `export default ${componentName};`
        const response = `${importLine}\n\n${declareLine}\n${returnLine}\n${content}\n${endReturnLine}\n${declareEndLine}\n\n${exportLine}`

        return response;
    }
};

module.exports = Component;
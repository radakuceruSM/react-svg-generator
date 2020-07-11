const fs = require("fs");
const jsxGenerator = require("svg-to-jsx");

const generateComponents = (directories) => {
    const response = directories.map(dir => {
        const result = generateComponent(dir);
        if (result) {
            return result;
        }
    });

    return Promise.all(response);
}

const generateComponent = async (directory) => {
    try {
        const path = directory.substr(0, directory.lastIndexOf('/'));
        const name = directory.replace(path + "/", "").replace(".svg", "").replace(/[\W_]+/g, " ");
        const componentName = name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
        const componentPath = path + "/" + componentName + ".jsx";
        const rawJsx = await _generateJSXfromSVG(directory);

        _generateJSXfile(componentPath, componentName, rawJsx);
        console.log(rawJsx)

        return componentPath;
    } catch (error) {
        return null;
    }
}

const _generateJSXfromSVG = async (path) => {
    try {
        const file = fs.readFileSync(path);
        return await jsxGenerator(file);
    } catch (error) {
        return null;
    }
};

const _generateJSXfile = (path, componentName, rawJsx) => {

    return fs.writeFileSync(path, _makeJSXcomponent(componentName, rawJsx));
}

const _makeJSXcomponent = (componentName, rawJsx) => {
    const tab = `    `;
    const importLine = `import React from "react";`;
    const declareLine = `const ${componentName} = (props) => {`;
    const returnLine = `${tab}return (`
    const content = rawJsx.split("\n").map(line => tab + tab + line).join("\n");
    const endReturnLine = `${tab});`
    const declareEndLine = `};`
    const exportLine = `export default ${componentName};`
    const response = `${importLine}\n\n${declareLine}\n${returnLine}\n${content}\n${endReturnLine}\n${declareEndLine}\n\n${exportLine}`

    return response;
}

module.exports = {
    generateComponents,
    generateComponent
}
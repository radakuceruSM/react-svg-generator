const Component = require("./component");

const args = require("./args");

const {
    getDirectories
} = require("./directory");

const main = async () => {
    const options = args();

    const directories = getDirectories(options.path, "svg");

    const result = await new Component(directories, options.colors, options.sizes).generateComponents();
    console.log(result);

    return result;
}

module.exports = main();
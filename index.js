const {
    getDirectories
} = require('./directory');

const args = require("./args");

const {
    generateComponents
} = require('./component');

const main = async () => {
    const options = args();

    const directories = getDirectories(options.path, "svg");

    const result = await generateComponents(directories);
    console.log(result);

    return result;
}

module.exports = main();
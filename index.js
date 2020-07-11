const {
    getDirectories
} = require('./directory');

const args = require("./args");

const main = () => {
    const options = args();

    const dir = getDirectories(options.path, "svg");

    console.log(dir);
}

module.exports = main();
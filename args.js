const yargs = require('yargs');

const args = () => {
    yargs.option('color', {
        alias: "c",
        type: "array",
        default: []
    });

    yargs.option('sizes', {
        alias: "s",
        type: "array",
        default: []
    });

    yargs.option('path', {
        alias: "p",
        type: "string",
        default: process.cwd()
    });

    return yargs.argv;
}

module.exports = args;
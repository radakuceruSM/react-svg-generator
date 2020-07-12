const yargs = require('yargs');

const args = () => {
    yargs.option('colors', {
        alias: "c",
        type: "array",
        default: []
    });

    yargs.option('sizes', {
        alias: "s",
        type: "string",
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
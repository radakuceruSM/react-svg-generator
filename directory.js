const glob = require("glob");

const getDirectories = (src, fileType) => {
    const path = `${src}/**/*.${fileType.replace(".", "")}`;

    const directories = glob.sync(path, {
        ignore: "**/node_modules/**"
    });

    return directories;
}

module.exports = {
    getDirectories
}
const config = require("./webpack.shared.config.js").config;

config.devtool = 'source-map';

module.exports = config;

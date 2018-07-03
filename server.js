// const express = require('express');
// const app = express();
//
// app.use(express.static(__dirname));
//
// app.listen(3000);


const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
let config = require('./webpack.config.local');


const execSync = require('child_process').execSync;
const opn = require('opn');

const port = process.env.NODE_PORT || 443;

// We're doing it because as part of the caching solution for the manifest described here:
// https://github.com/webpack/webpack/tree/master/examples/chunkhash
// For the dev server the `chunkhash` in `filename` doesn't work, so we have to set it to `hash` here instead.
// The default in the shared config is set tot he right value for the non dev server builds, so here we're correcting it
// for dev server.
config.output.filename = '[name]-[hash].js';

////////// Temp solution ///////////

// TODO - Disable all info / logs for HMR until the log level issue will be fixed - https://github.com/webpack/webpack/issues/4115
const replaceInFile = (filePath, searchRegex, replaceString) => {
  const fs = require('fs');
  filePath = path.resolve(filePath);

  /* eslint-disable consistent-return */
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }

    const result = data.replace(searchRegex, replaceString);

    fs.writeFile(filePath, result, 'utf8', function(err) {
      if (err) {
        return console.log(err);
      }
    });
  });
  /* eslint-enable consistent-return */
};

const emptyStatement = '(function console_$1(){})';
const consoleRegex = /console\.(info|log)/g;
replaceInFile("node_modules/webpack/hot/only-dev-server.js", consoleRegex, emptyStatement);
replaceInFile("node_modules/webpack/hot/log-apply-result.js", consoleRegex, emptyStatement);

////////// End of temp solution ///////////

// HMR (Hot Module Replacement) support
config.entry.application.unshift('webpack/hot/only-dev-server');
config.entry.application.unshift(`webpack-dev-server/client?${config.output.publicPath}`);

if (process.env.DISABLE_REACT_HMR !== 'true') {
  config.entry.application.unshift('react-hot-loader/patch');
}

// HMR (Hot Module Replacement) plugins
config.plugins.push(new webpack.HotModuleReplacementPlugin());


const compiler = webpack(config);

/**
 * Opens the app in the browser
 * @returns {void}
 */
function openBrowser() {
  if (process.platform === 'darwin') {
    try {
      // Try our best to reuse existing tab
      // on OS X Google Chrome with AppleScript
      execSync('ps cax | grep "Google Chrome"');
      execSync(
        'osascript ' +
        path.resolve(__dirname, './openChrome.applescript ') +
        config.output.publicPath
      );
      return;
    } catch (err) {
      // Ignore errors.
    }
  }

  // Fallback to opn
  // (It will always open new tab)
  opn(config.output.publicPath);
}

const getDevServerOptions = require('./devServerOptions');
const devServerOptions = getDevServerOptions({
  port,
  publicPath: config.output.publicPath
});

new WebpackDevServer(compiler, devServerOptions).listen(port, '0.0.0.0', (err, result) => {
  if (err) {
    console.log(err);
  }

  openBrowser();
});

const url = require('url');

const getDevServerOptions = (options) => {
  return Object.assign({
    host: "0.0.0.0",
    public: `${url.parse(options.publicPath).hostname}:${options.port}`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ
      'Accept-Ranges': 'bytes'
    },
    overlay: {
      errors: true,
      warnings: true
    },
    historyApiFallback: true,
    clientLogLevel: 'warning',
    quiet: true,
    hot: true
  }, {
    port: options.port,
    publicPath: options.publicPath
  });
};

module.exports = getDevServerOptions;

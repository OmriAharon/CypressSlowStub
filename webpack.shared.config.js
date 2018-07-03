const path = require('path');

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


process.env.NODE_ENV = process.env.NODE_ENV || 'local';
const mode = 'development';
const port = 3000;
const hostAddress = process.env.HOST_ADDRESS;
const hostProtocol = 'http';
let publicPath = `${hostProtocol}://${hostAddress}`;

if (port && port !== "443") {
  publicPath = `${publicPath}:${port}`;
}

publicPath = `${publicPath}/`;

// Paths
const rootDirectory = path.resolve(__dirname, './');
const srcPath = path.resolve(rootDirectory, 'src');
const nodeModulesPath = path.resolve(rootDirectory, 'node_modules');
const indexHtmlPath = path.resolve(rootDirectory, 'index.html');
const indexHtmlTitle = 'Cypress Stubbing Reproducible';
const buildPath = path.resolve(rootDirectory, 'dist');

const config = {
  mode,
  entry: {
    application: [path.join(srcPath, 'index.js')]
  },
  output: {
    // Next line is not used in local but WebpackDevServer crashes without it:
    path: buildPath,
    libraryTarget: 'umd',
    publicPath
  },
  resolve: {
    symlinks: false,
    extensions: ['.js']
  },
  resolveLoader: {
    modules: [nodeModulesPath]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [srcPath],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 1000
        }
      }
    ]
  },
  plugins: [

    new HtmlWebpackPlugin({
      title: indexHtmlTitle,
      inject: true,
      template: indexHtmlPath
    })
  ],

  optimization: {
    namedModules: true,
    runtimeChunk: true,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        include: /\.(js)$/
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: (module) => {
            const name = module.nameForCondition && module.nameForCondition();
            return !!name;
          }
        }
      }
    }
  }
};

if (process.argv[1].indexOf('start.js') !== -1) {
  const DashboardPlugin = require('webpack-dashboard/plugin');
  config.plugins.push(new DashboardPlugin());
}

module.exports = {
  config,
  rootDirectory,
  srcPath,
  port
};

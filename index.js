var path = require('path')
var webpack = require('webpack')
var defaults = require('lodash.defaults')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CompressionPlugin = require('compression-webpack-plugin')
var getBaseConfig = require('./lib/base-config')
var devEnvs = [
  'development',
  'dev',
  'test'
]

var isDev = useDev()

/**
 * figure out if we're running `webpack` or `webpack-dev-server`
 */
function useDev () {
  return devEnvs.some(isEnv) || process.argv[1].indexOf('webpack-dev-server') !== -1
}

function isEnv (env) {
  return process.env.NODE_ENV === env
}

module.exports = function (opts) {

  _checkRequired(opts)

  var appPath = path.resolve(opts.in)
  var outputFolder = path.resolve(opts.out)
  var config, plugins, stylePathResolves, cssLoaderOptions

  /**
   * Set the specifications from webpack.config
   */
  var spec = defaults(opts, {
    entry: isDev ? [ appPath ] : { app: appPath, vendors: opts.vendors },
    output: {
      path: outputFolder + '/',
      publicPath: '/',
      filename: opts.isDev ? 'bundle.js' : '[name].[hash].js',
      cssFilename: opts.isDev ? 'style.css' : 'style.[hash].css'
    },
    stylePath: './',
    cssModules: false,
    host: 'localhost',
    port: 8080,
    resolves: [],
    isDev: isDev,
    html: {}
  })

  config = getBaseConfig(spec)
  plugins = _getPlugins(spec.isDev)

  // sass loader requires we specify paths to check for imports
  stylePathResolves = (
    'includePaths[]=' + path.resolve(spec.stylePath) + '&' +
    'includePaths[]=' + path.resolve('./node_modules')
  )

  var cssLocalIdentName = 'localIdentName=[local]__[hash:base64:5]'
  cssLoaderOptions = spec.cssModules
    ? '?modules&' + cssLocalIdentName
    : '?' + cssLocalIdentName

  if (spec.isDev) {

    /**
     * Dev specific configurations
     */

    config.devtool = 'eval'
    config.plugins = config.plugins.concat(plugins)
    config.module.loaders[0].loaders.unshift('react-hot')
    config.entry.unshift(
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://' + spec.host + ':' + spec.port
    )
    config.module.loaders.push(
      {
        test: /(\.css)$/,
        loader: 'style!css' + cssLoaderOptions + '!postcss'
      },
      {
        test: /(\.scss)$/,
        loader: 'style!css' + cssLoaderOptions + '!sass?outputStyle=expanded&' + stylePathResolves
      }
    )

  } else {

    /**
     * Production specific configurations
     */

    config.devtool = 'source-map'
    config.plugins = config.plugins.concat(plugins)

    /**
     * ExtractTextPlugin moves every style import in entry chunks into a separate css
     * output file. Stylesheet bundle is loaded in parallel to the javascript bundle.
     * See: https://github.com/webpack/extract-text-webpack-plugin
     */
    config.plugins = config.plugins.concat([
      new ExtractTextPlugin(config.output.cssFilename, {
        allChunks: true
      })
    ])

    config.module.loaders.push(
      {
        test: /(\.css)$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css' + cssLoaderOptions + '!postcss'
        )
      },
      {
        test: /(\.scss)$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css' + cssLoaderOptions + '!postcss!sass?outputStyle=expanded&' + stylePathResolves
        )
      }
    )

  }

  return config
}

/**
 * Throws error if required opts aren't provided
 */
function _checkRequired (opts) {
  var props = ['out', 'in']
  if (!opts || !props.every(function (prop) { return opts.hasOwnProperty(prop) })) {
    throw new Error('Must pass in options with `in`, `out` properties')
  }
}

function _getPlugins (isDev) {
  return isDev ?
    _getDevPlugins() :
    _getProductionPlugins()
}

function _getDevPlugins () {
  return [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      '__DEV__': true,
      '__PROD__': false
    })
  ]
}

function _getProductionPlugins () {
  return [

    /**
     *  Searches for equal or similar files and deduplicates them in the output.
     */
    new webpack.optimize.DedupePlugin(),

    /**
     * Reduces the total file size and is recommended. So why not?
     */
    new webpack.optimize.OccurenceOrderPlugin(true),

    /**
     * Generates an extra chunk, which contains vendor modules shared between
     * entry points.
     */
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),

    /**
     * This reduces the react lib size by notifying it when we are in production.
     */
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      },
      '__DEV__': false,
      '__PROD__': true
    }),

    /**
     * Minification!
     */
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),

    /**
     * Source of our gzip power!
     */
    new CompressionPlugin({
      asset: '{file}.gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}

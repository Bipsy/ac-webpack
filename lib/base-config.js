var cssnext = require('cssnext')
var cssimport = require('postcss-import')
var HtmlPlugin = require('./html-plugin')

module.exports = function getBaseConfig (spec) {
  var html = spec.isDev ? spec.html.dev : spec.html.prod

  // ensure node_modules directory is always being resolved
  if (spec.resolves.indexOf('node_modules') < 0) {
    spec.resolves.push('node_modules')
  }

  return {
    entry: spec.entry,

    output: spec.output,

    resolve: {
      extensions: [
        '',
        '.js',
        '.css',
        '.scss'
      ],

      modulesDirectories: spec.resolves

    },

    postcss: function () {
      return [
        cssimport({
          // see postcss-import docs to learn about onImport callback
          // https://github.com/postcss/postcss-import
          path: spec.stylePath,
          onImport: function (files) {
            files.forEach(this.addDependency)
          }.bind(this)
        }),
        cssnext()
      ]
    },

    plugins: [

      /**
       * Dynamically generates the index.html page to work for dev or production.
       */
      new HtmlPlugin({
        html: html
      })
    ],

    module: {
      loaders: [

        // javascript

        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loaders: [

            /**
             * Transpiles JSX in addition to ES6+ functionality
             * 1. npm i babel-runtime & add ?optional=runtime to allow us to seamlessly
             * use Promise & other Babel features that require polyfill.
             */
            'babel?optional=runtime' /* [1] */
          ]
        },

        // image assets

        {
          test: /\.(png|svg|jpg)$/,

          /**
           * convert resolved paths as BASE64 strings for images under 25kb
           */
          loaders: [
            'url?limit=25000'
          ]
        }

      ]

    }
  }

}

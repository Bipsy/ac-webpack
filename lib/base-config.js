var cssnext = require('cssnext')
var cssimport = require('postcss-import')
var HtmlPlugin = require('./html-plugin')

module.exports = function getBaseConfig (spec) {
  return {
    entry: spec.entry,

    output: spec.output,

    resolve: {
      extensions: [
        '',
        '.js',
        '.css'
      ],

      modulesDirectories: spec.resolves
    },

    postcss: function () {
      return [
        cssimport({
          // see postcss-import docs to learn about onImport callback
          // https://github.com/postcss/postcss-import
          path: './src/styles/',
          onImport: function (files) {
            files.forEach(this.addDependency)
          }.bind(this)
        }),
        cssnext(),
        function fn (css) {
          css.eachDecl(function (decl) {
              // console.log(decl.value, 'hippos')

          // Match if the declaration value has the 'vr' unit.
            if (decl.value.match(/pnt/)) {

              // Replace the declaration value with the calculated value.
              // Use parseFloat() to remove the `vr` unit from the string and return a number.

            }
          })
        }
      ]
    },

    plugins: [

      /**
       * Dynamically generates the index.html page to work for dev or production.
       */
      new HtmlPlugin({
        isDev: spec.isDev,
        html: spec.html
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
             * 1. optional=runtime allows us to seamlessly use Promise
             * & other Babel features that require polyfill.
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

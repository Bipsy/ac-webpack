Wepack Configuration
====================

Support for development & production environments. 

While developing:
+ transpile ES6+ (including polyfills for features like promises), JSX, CSSNext
+ livereload on change
+ dynamically generate index.html 

For deployment:
+ Minify, bundle and compress js, css, and vendor bundles
+ Outputs uniquely named (hashed) static js & css files
+ dynamically generate customized index.html to match hashed static files

### Usage

in `webpack.config.js`:

```js
var getConfig = require('./config/ac-webpack')

/** 
 * 1. Required
 */
module.exports = getConfig({

  in: 'src/index.js' /* [1] */,

  out: 'public' /* [1] */,

  /**
   * Production index.html settings. Used to generate dynamic
   * index for both dev & prod.
   */
  htmlConfig: {
    title: 'App Title',
    favicon: '/assets/favicon.ico', /* relative path from index */
    googleFonts: [
      'Noto+Sans'
    ],
    gaId: 'UA-47141819-4', /* google analytics support */
    reactHook: {
      attr: 'id', /* alternatively could prefer class */
      value: 'app'
    }
  }, 
  
  /**
   * Files to split into separate vendor bundle. Should only include
   * libraries that aren't likely to change any time soon.
   */
  vendors: [
    'react', 
    'react-router'
  ],

  /**
   * Directories to check for module imports
   * see: https://gist.github.com/ryanflorence/daafb1e3cb8ad740b346
   */
  resolves: [
    'shared',
    'components',
    'node_modules'
  ]

})
 
```

### Running the environments

```json
{
  "name": "app",
  "scripts": {
    "start": "webpack-dev-server",
    "build": "NODE_ENV=production webpack -p"
  }
}
```

This is heavily based off of and borrowed from the work of Henrik Joreteg & Christian Alfoni.

+ Henrik Joreteg's [hjs-webpack](https://github.com/HenrikJoreteg/hjs-webpack) configuration
+ Christian Alfoni [ultimate Webpack setup](http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup)

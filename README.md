[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Wepack Configuration
====================
AncestorCloud's opinionated, configurable webpack set up for developing & deploying javascript applications using ES2015.

### Motivation
Webpack is awesome and makes developing javascript applications a relative joy. It is a powerful end-to-end tool for building maintainable, scalable applications from development to deployment. With that said, it can be _tedious & daunting_ to configure all of that using available wepack docs & api. `ac-Webpack` serves to provide a simplified, opinionated way to configure webpack for development and then build for production.

### Features

While developing:
+ transpile ES6+ (including polyfills for features like promises), JSX, CSSNext
+ livereload on change
+ dynamically generate index.html 

For deployment:
+ Minify, bundle and compress js, css, and vendor bundles
+ Outputs uniquely named (hashed) static js & css files
+ dynamically generate customized index.html to match hashed static files

Project structure:
Henrik Joreteg has a fabulous webpack configuration ([hjs-webpack](https://github.com/HenrikJoreteg/hjs-webpack)) that does pretty much this, and we heavily borrowed from his work. In addition though, we wanted to build in support for customized project structures such as:
* Ryan Florence's [approach](https://gist.github.com/ryanflorence/daafb1e3cb8ad740b346) to organizing scalable, modular, team-centric react apps.
* Twitter's component-centric organizational [approach](http://www.thedotpost.com/2014/11/nicolas-gallagher-thinking-beyond-scalable-css) led by Nicolas Gallagher.

### Usage

#### Step 1: Install
`npm install --save-dev ac-webpack`

#### Step 2: Configure

##### Most Basic: 
This is the most basic set up you need to get going:

in `webpack.config.js`:

```js
var getConfig = require('ac-webpack')

module.exports = getConfig({
  in: 'src/index.js' 
  out: 'public'
})
 
```
* `in` (required) - This should just be the path to the file that serves as the main entry point of your application.
* `out` (required) - Path to directory where we're going to put generated files.


### Step 3: configure scripts

in `package.json`:

```json
{
  "name": "app",
  "scripts": {
    "start": "webpack-dev-server",
    "build": "NODE_ENV=production webpack -p"
  }
}
```

### Step 4: Build
Open up your terminal and cd into the root of your project directory where `webpack.config.js` is.

Run your dev script:

`npm start`

This will bundle your project, spin up a server, and live reload when you save changes in a file

Run your build script

`npm run build`

After some magic webpack bundling work, this will output minified, hashed, production ready files for your app in the specified `out` directory


### Additional Config options

#### html

#### vendors

#### resolves


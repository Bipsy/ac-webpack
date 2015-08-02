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


#### Step 3: configure scripts

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

#### Step 4: Build
Open up your terminal and cd into the root of your project directory where `webpack.config.js` is.

Run your dev script:

`npm start`

This will bundle your project, spin up a server, and live reload when you save changes in a file

Run your build script

`npm run build`

After some magic webpack bundling work, this will output minified, hashed, production ready files for your app in the specified `out` directory


### Additional Config options

#### html (optional, object)
You have the option to build your own dev & production html. This is done by passing in an `html` property into the config with the properties `dev` && / || `prod`.

If html.dev || html.prod are _not_ present, the following default html template will be used (production will also have a css link):

```html
<!doctype html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
</head>
<body>
  <div id="app"></div>
  <script src="bundle.js"></script>
</body>
```

##### Examples
This part of the api needs additional love, thought and attention. For now, I recommend borrowing heavily from the following examples. 

* Note `dev` receives only a `.main` property representing the entirety of the app's javascript. `dev` has no css file because all css scripts will be placed in the head by webpack. 

* `prod` receives {css, app[, vendors]} where `css` is the name of the hashed, concatenated, & minified css file, `app` is the named of the js file containing all of the app's javascript minus any node_moudles that may be specified as `vendors`. All of these files are concatenated, minified, & hashed.

```js
html: {
  dev: function (data) {
    return {
      'index.html': [
        '<html>',
          '<head>',
            '<meta charset="utf-8"/>',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            '<link href="http://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet" type="text/css">',
          '</head>',
          '<body>',
            '<div id="app"></div>',
            '<script src="/' + data.main + '"></script>',
          '</body>',
        '</html>'
      ].join('')
    }
  },
  prod: function (data) {
      var config = {
        title: 'Ac Example App',
        favicon: '/assets/icons/favicon.ico',
        gaId: '',
        errorceptionId: ''
      }

      return {
        'index.html': [
          '<html>',
            '<head>',
              '<meta charset="utf-8"/>',
              '<meta name="viewport" content="width=device-width, initial-scale=1">',
              '<title>' + config.title + '</title>',
              '<link rel="icon" href="' + config.favicon + '" type="image/x-icon" />',
              '<link href="/' + data.css + '" rel="stylesheet" type="text/css" />',
              '<link href="http://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet" type="text/css">',

              '<script>(function(_,e,rr,s){_errs=[s];var c=_.onerror;_.onerror=function(){var a=arguments;_errs.push(a);' +
              'c&&c.apply(this,a)};var b=function(){var c=e.createElement(rr),b=e.getElementsByTagName(rr)[0];' +
              'c.src="//beacon.errorception.com/"+s+".js";c.async=!0;b.parentNode.insertBefore(c,b)};' +
              '_.addEventListener?_.addEventListener("load",b,!1):_.attachEvent("onload",b)})' +
              '(window,document,"script","' + config.errorceptionId + '");</script>',

              '<script>(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){' +
              '(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),' +
              'm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)' +
              '})(window,document,"script","//www.google-analytics.com/analytics.js","ga");' +

              'ga("create", "' + config.gaId + '", "auto");</script>',
            '</head>',
            '<body>',
              '<div id="app"></div>',
              '<script src="/' + data.vendors + '"></script>',
              '<script src="/' + data.app + '"></script>',
            '</body>',
          '</html>'
        ].join('')
      }
    }
}
 
```

#### vendors

#### resolves


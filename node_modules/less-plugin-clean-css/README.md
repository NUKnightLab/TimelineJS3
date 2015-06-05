[![NPM version](https://badge.fury.io/js/less-plugin-clean-css.svg)](http://badge.fury.io/js/less-plugin-clean-css) [![Dependencies](https://david-dm.org/less/less-plugin-clean-css.svg)](https://david-dm.org/less/less-plugin-clean-css) [![devDependency Status](https://david-dm.org/less/less-plugin-clean-css/dev-status.svg)](https://david-dm.org/less/less-plugin-clean-css#info=devDependencies) [![optionalDependency Status](https://david-dm.org/less/less-plugin-clean-css/optional-status.svg)](https://david-dm.org/less/less-plugin-clean-css#info=optionalDependencies)

less-plugin-clean-css
=====================

Compresses the css output from less using clean-css.

## lessc usage

```
npm install -g less-plugin-clean-css
```

and then on the command line,

```
lessc file.less --clean-css="--advanced --compatibility=ie8"
```

See [clean-css](https://github.com/jakubpawlowicz/clean-css) for the available command options - the only difference is advanced which we default to false, because it is not always entirely safe.

## Programmatic usage

```
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleanCSSPlugin = new LessPluginCleanCSS({advanced: true});
less.render(lessString, { plugins: [cleanCSSPlugin] })
  .then(
```

## Browser usage

Browser usage is not supported at this time.

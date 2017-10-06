require("../index.html")
require("../css/icons/icons.html")
require("../embed/embed.html")
require("../assets/example.png")
requireAll(require.context("../css/icons", true, /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/));
require("../less/TL.Timeline.less")
require("../less/themes/dark/TL.Theme.Dark.less")
requireAll(require.context("../less/fonts", true, /^(?!.*font.base).*\.less$/))
requireAll(require.context("./language/locale", true, /\.json$/));
requireAll(require.context("../examples/", true, /\.json$/));
requireAll(require.context("../examples/", true, /\.html$/));

function requireAll(requireContext) {
  console.log(requireContext.keys())
  return requireContext.keys().map(requireContext);
}


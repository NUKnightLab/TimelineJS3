require("../index.html");
require("../css/icons/icons.html")
require("../embed/embed.html")
require("../assets/example.png")
requireAll(require.context("../css/icons", true, /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/));
requireAll(require.context("./language/locale", true, /\.json$/));

function requireAll(requireContext) {
console.log(requireContext.keys())
  return requireContext.keys().map(requireContext);
}
// requires and returns all modules that match


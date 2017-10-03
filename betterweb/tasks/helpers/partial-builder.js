var globby = require('globby'),
    fs = require('fs-extra');

var getPartial = function(Handlebars, rootPath) {
  globby.sync(rootPath + '*.hbs').forEach(function(file) {
    var partialName = file.replace(rootPath, "").replace(".hbs", "");
    Handlebars.registerPartial(partialName, fs.readFileSync(file, "utf8"));
  })
}

module.exports = {
  getPartial: getPartial
}

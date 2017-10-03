var _ = require('lodash'),
    fm = require('front-matter'),
    yml = require('yamljs'),
    fs = require('fs-extra'),
    path = require('path'),
    Handlebars = require('handlebars'),
    globby = require('globby'),
    debug = require('./helpers/debug-hbs.js'),
    helper = require('./helpers/partial-builder.js');

data = getData('src/data/data.yml');

//run Helpers
helper.getPartial(Handlebars, 'src/templates/partials/');

function getData(file) {
    fileName = path.basename(file, '.yml');

    return yml.load(file);
}

function renderTemplate(templatePath, data) {
  var file = fs.readFileSync(templatePath, 'utf8'),
      frontMatter = fm(file),
      fmData = frontMatter.attributes,
      context = _.extend(fmData, data),
      template = Handlebars.compile(frontMatter.body);

  return template(context);
}

function renderPage(template, layout, data) {
  var file = fs.readFileSync(layout, 'utf8'),
      page = Handlebars.compile(file),
      context = _.extend({body: template}, data);

  return page(context);
}

function build() {
  var hbsTemplates = globby.sync('src/templates/**/*.hbs');

  _.forEach(hbsTemplates, function(file, i) {
    var filePattern = path.dirname(file).split('src/templates/')[1],
        fileName = path.basename(file, '.hbs'),
        template = renderTemplate(file, data),
        page = renderPage(template, 'src/templates/layouts/default.hbs', data);

    if(!!filePattern) {
      fs.outputFileSync(`dist/templates/${filePattern}/${fileName}.html`, page, 'utf8')
    } else if(fileName === 'index') {
        fs.outputFileSync(`dist/index.html`, page, 'utf8')
    } else {
      fs.outputFileSync(`dist/templates/${fileName}.html`, page, 'utf8');
    }
  });

}

build();

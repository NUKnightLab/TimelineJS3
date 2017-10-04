var _ = require('lodash'),
    fm = require('front-matter'),
    yml = require('yamljs'),
    fs = require('fs-extra'),
    path = require('path'),
    Handlebars = require('handlebars'),
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
  var fileName = 'src/templates/index.hbs'

  template = renderTemplate(fileName, data),
  page = renderPage(template, 'src/templates/layouts/default.hbs', data);
  fs.outputFileSync(`dist/index.html`, page, 'utf8')
}

build();

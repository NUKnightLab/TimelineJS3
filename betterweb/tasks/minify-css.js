var cssmin = require('cssmin'),
    fs = require('fs-extra'),
    css = fs.readFileSync("dist/css/main.css", 'utf8'),
    min = cssmin(css);

fs.outputFileSync('dist/css/main.min.css', min, 'utf8');

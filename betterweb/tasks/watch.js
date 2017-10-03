var chokidar = require('chokidar'),
    path = require('path'),
    shell = require('shelljs'),
    tinylr = require('tiny-lr'),
    exit = require('exit-hook'),

    tinyServer = tinylr();

var watcher = chokidar.watch(['src/scss', 'dist/css', 'src/js', 'src/templates', 'src/assets'], {
  ignored: /[\/\\]\./,
  ignoreInitial: true
});

tinyServer.listen(35729, function() {
  console.log('Livereload working...')
})

watcher.on("add", function(file) {
  runProcess(file);
})

watcher.on("change", function(file) {
  runProcess(file);
})

watcher.on("unlink", function(file) {
  runProcess(file);
})

function runProcess(file) {
  var filext = path.extname(file);
  if(filext === '.scss') {
    shell.exec('npm run sass', function() {
      console.log('Rebuilding sass...');
    });
  } else if((filext === '.css') || (filext === '.js')) {
    tinylr.changed(file);
  } else if(filext === '.hbs') {
    shell.exec('npm run templates', function() {
      console.log('Rebuilding templates...')
    })
  } else {
    shell.exec('npm run copy', function() {
      console.log('Copying assets...')
    })
  }
}

exit(function() {
  console.log('exiting...');
  watcher.close();
  tinyServer.close();
})

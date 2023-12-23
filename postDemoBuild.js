var fs = require('fs')
fs.readFile('./docs/main.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replaceAll('/assets/fonts', './assets/fonts');

  fs.writeFile('./docs/main.js', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});

var fs = require('fs');
const package = require('./package.json');

fs.readFile('./docs/main.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replaceAll('/assets/fonts', './assets/fonts');

  fs.writeFile('./docs/main.js', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });

  const versionJson = {
    version: package.version,
    name: package.name,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync('./docs/version.json', JSON.stringify(versionJson));
});

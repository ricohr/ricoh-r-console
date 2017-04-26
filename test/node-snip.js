var Application = require('spectron').Application;
var app = new Application({
  path: './node_modules/.bin/electron',
  args: [
    '.',
    '--dialogfixture=./test-tmp/dialogFixture.json',
    '--mtpfixture=./test/devicePropFixture.json'
  ]
});

module.exports = app;

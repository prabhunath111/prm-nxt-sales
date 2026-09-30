const fs = require('fs');
const path = require('path');

const appComponents = fs.readdirSync(
  path.join(__dirname, '../../src/components'),
);
const appContainers = fs.readdirSync(path.join(__dirname, '../../src/screens'));

const components = appComponents.concat(appContainers);

function componentExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;

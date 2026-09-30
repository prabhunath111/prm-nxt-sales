const componentGenerator = require('./component');
const screenGenerator = require('./screens');
const utilityGenerator = require('./utility');
const reduxGenerator = require('./redux');
module.exports = (plop) => {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('screens', screenGenerator);
  plop.setGenerator('utils', utilityGenerator);
  plop.setGenerator('redux', reduxGenerator);
};
/* You may add multiple generators based on your requirements. */

const chalk = require('chalk');
exports.minimumCharacters = function (charactercount, value) {
  if (value.length < charactercount) {
    return `You have not met the minimum requirements for a description. You still have ${chalk.red(
      charactercount - value.length,
    )} characters that are required.`;
  }
  return true;
};

exports.firstLetterCaps = function (value) {
  if (!/^[A-Z]/.test(value)) {
    return 'The component name must be capitalized!';
  }
  return true;
};

exports.uppercaseandonlyunderscore = function (value) {
  if (!/^[a-z]+(?:_+[a-z]+)*$/.test(value)) {
    return 'The package name can only container lower case letters and underscores';
  }
  return true;
};

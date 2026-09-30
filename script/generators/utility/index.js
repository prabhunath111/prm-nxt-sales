const validations = require('../utils/validations');
const componentExists = require('../checks');

module.exports = {
  description: 'Creates a Global utility',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Name of the utility: ',
      default: 'Button',
      validate: (name) => {
        if (/.+/.test(name)) {
          return componentExists(name)
            ? 'A utils with this name already exists'
            : true;
        }
        return 'The name is required';
      },
    },
    {
      type: 'input',
      name: 'componentDescription',
      message: 'Please add a description for this utility',
      validate: (value) => {
        let validation = validations.minimumCharacters(20, value);
        return validation;
      },
    },
  ],
  actions: [
    {
      type: 'add',
      path: '../../src/utils/{{pascalCase name}}.ts',
      templateFile: './utility/utils.tsx.hbs',
    },
  ],
};

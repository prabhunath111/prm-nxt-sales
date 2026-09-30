const validations = require('../utils/validations');
const componentExists = require('../checks');

module.exports = {
  description: 'Creates a Global Component for prm or sales',
  prompts: [
    {
      type: 'list',
      name: 'module',
      message: 'Which module does this component belong to?',
      choices: ['prm', 'sales'],
      default: 'prm',
    },
    {
      type: 'input',
      name: 'name',
      message: 'Name of the component: ',
      default: 'Button',
      validate: name => {
        if (/.+/.test(name)) {
          return componentExists(name)
            ? 'A component or container with this name already exists'
            : true;
        }
        return 'The name is required';
      },
    },
    {
      type: 'input',
      name: 'componentDescription',
      message: 'Please add a description for this component',
      validate: value => {
        let validation = validations.minimumCharacters(20, value);
        return validation;
      },
    },
  ],
  actions: [
    {
      type: 'add',
      path: '../../src/components/{{module}}/{{pascalCase name}}/index.tsx',
      templateFile: './component/index.tsx.hbs',
    },
    {
      type: 'add',
      path: '../../src/components/{{module}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
      templateFile: './component/component.tsx.hbs',
    },
    {
      type: 'add',
      path: '../../src/components/{{module}}/{{pascalCase name}}/{{pascalCase name}}.styles.tsx',
      templateFile: './component/styles.tsx.hbs',
    },
    {
      type: 'add',
      path: '../../src/components/{{module}}/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
      templateFile: './component/stories.tsx.hbs',
    },
    {
      type: 'add',
      path: '../../src/components/{{module}}/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
      templateFile: './component/test.tsx.hbs',
    },
    {
      type: 'append',
      path: '../../src/components/{{module}}/index.tsx',
      pattern: /(\/\* COMPONENT IMPORTS \*\/)/g,
      template: "import {{pascalCase name}} from './{{pascalCase name}}';",
    },
    {
      type: 'append',
      path: '../../src/components/{{module}}/index.tsx',
      pattern: /(\/\* COMPONENT EXPORTS \*\/)/g,
      template: '  {{pascalCase name}},',
    },
  ],
};

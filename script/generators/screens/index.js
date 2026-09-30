const componentExists = require('../checks');
const validations = require('../utils/validations');

module.exports = {
  description: 'Creates an App Screen',
  prompts: [
    {
      name: 'name',
      message: 'Name of the src screen: ',
      default: 'HomeScreen',
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
    {
      type: 'list',
      name: 'input',
      message: 'Choose component type: ',
      choices: ['class', 'function'],
      default: 'function',
    },
    {
      type: 'list',
      name: 'folder',
      message: 'Which folder do you want to create the screen in?',
      choices: ['prm', 'sales'],
      default: 'prm',
    },
  ],
  actions: res => {
    const folderPath = `../../src/screens/${res.folder}`;
    const actions = [
      {
        type: 'add',
        path: '../../src/screens/{{pascalCase name}}/{{pascalCase name}}.styles.tsx',
        path: `${folderPath}/{{pascalCase name}}/{{pascalCase name}}.styles.tsx`,
        templateFile: './screens/styles.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../src/screens/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
        path: `${folderPath}/{{pascalCase name}}/{{pascalCase name}}.test.tsx`,
        templateFile: './screens/test.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../src/screens/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
        path: `${folderPath}/{{pascalCase name}}/{{pascalCase name}}.stories.tsx`,
        templateFile: './screens/stories.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../src/screens/{{pascalCase name}}/index.tsx',
        path: `${folderPath}/{{pascalCase name}}/index.tsx`,
        templateFile: './screens/index.tsx.hbs',
        abortOnFail: true,
      },
    ];
    if (res.input === 'function') {
      actions.push({
        type: 'add',
        path: '../../src/screens/{{pascalCase name}}/{{pascalCase name}}.tsx',
        path: `${folderPath}/{{pascalCase name}}/{{pascalCase name}}.tsx`,
        templateFile: './screens/function.tsx.hbs',
        abortOnFail: true,
      });
    }
    if (res.input === 'class') {
      actions.push({
        type: 'add',
        path: '../../src/screens/{{pascalCase name}}/index.tsx',
        path: `${folderPath}/{{pascalCase name}}/index.tsx`,
        templateFile: './screens/class.tsx.hbs',
        abortOnFail: true,
      });
    }
    return actions;
  },
};
const fs = require('fs');
const path = require('path');
const validations = require('../utils/validations');
const componentExists = require('../checks');

const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

module.exports = {
  description: 'Creates a reducer',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Name of the reducer: ',
      default: 'Button',
      validate: (name) => {
        if (/.+/.test(name)) {
          return componentExists(name)
            ? 'A reducer with this name already exists'
            : true;
        }
        return 'The name is required';
      },
    },
    {
      type: 'input',
      name: 'componentDescription',
      message: 'Please add a description for this reducer',
      validate: (value) => {
        let validation = validations.minimumCharacters(20, value);
        return validation;
      },
    },
    {
      type: 'list',
      name: 'folder',
      message: 'Which folder do you want to create the reducer in?',
      choices: ['prm', 'sales'],
      default: 'prm',
    },
  ],
  actions: (res) => {
    const folderPath = `../../src/store/${res.folder}`;
    
    // Ensure the directory structure exists
    const directories = [
      `${folderPath}/reducer`,
      `${folderPath}/types`,
      `${folderPath}/actions`,
      `${folderPath}/query`,
    ];
    
    directories.forEach(dir => {
      createDirIfNotExists(path.resolve(__dirname, dir));
    });

    return [
      {
        type: 'add',
        path: `${folderPath}/reducer/{{camelCase name}}/{{camelCase name}}.reducer.ts`,
        templateFile: './redux/reducer.tsx.hbs',
      },
      {
        type: 'add',
        path: `${folderPath}/reducer/{{camelCase name}}/index.ts`,
        templateFile: './redux/reducerIndex.tsx.hbs',
      },
      {
        type: 'add',
        path: `${folderPath}/types/{{camelCase name}}/{{camelCase name}}.type.ts`,
        templateFile: './redux/types.tsx.hbs',
      },
      {
        type: 'add',
        path: `${folderPath}/types/{{camelCase name}}/index.ts`,
        templateFile: './redux/typeIndex.tsx.hbs',
      },
      {
        type: 'add',
        path: `${folderPath}/actions/{{camelCase name}}/{{camelCase name}}.action.ts`,
        templateFile: './redux/action.tsx.hbs',
      },
      {
        type: 'add',
        path: `${folderPath}/actions/{{camelCase name}}/index.ts`,
        templateFile: './redux/index.tsx.hbs',
      },
      {
        type: 'add',
        path: `${folderPath}/query/{{camelCase name}}/{{camelCase name}}.query.ts`,
        templateFile: './redux/query.tsx.hbs',
      },
      {
        type: 'add',
        path: `${folderPath}/query/{{camelCase name}}/index.ts`,
        templateFile: './redux/queryIndex.tsx.hbs',
      },
      {
        type: 'append',
        path: `${folderPath}/reducer/root.reducer.ts`,
        pattern: /(\/\* REDUCER IMPORTS \*\/)/g,
        template:
          "import {{camelCase name}}Reducer from './{{camelCase name}}/{{camelCase name}}.reducer';",
      },
      {
        type: 'append',
        path: `${folderPath}/reducer/root.reducer.ts`,
        pattern: /(\/\* REDUCER EXPORTS \*\/)/g,
        template: '     {{camelCase name}}: {{camelCase name}}Reducer,',
      },
      {
        type: 'append',
        path: `${folderPath}/query/index.tsx`,
        pattern: /(\/\* QUERY IMPORTS \*\/)/g,
        template:
          "import {{camelCase name}}Query from './{{camelCase name}}';",
      },
      {
        type: 'append',
        path: `${folderPath}/query/index.tsx`,
        pattern: /(\/\* QUERY EXPORTS \*\/)/g,
        template: '  ...{{camelCase name}}Query,',
      },
      {
        type: 'append',
        path: `${folderPath}/actions/index.ts`,
        pattern: /(\/\* ACTION IMPORTS \*\/)/g,
        template:
          "import {{camelCase name}}Actions from './{{camelCase name}}';",
      },
      {
        type: 'append',
        path: `${folderPath}/actions/index.ts`,
        pattern: /(\/\* ACTION EXPORTS \*\/)/g,
        template: '  ...{{camelCase name}}Actions,',
      },
    ];
  },
};

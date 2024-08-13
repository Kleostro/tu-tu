const { execSync } = require('child_process');
const inquirer = require('inquirer');

const entities = ['component', 'interface', 'directive', 'module', 'guard', 'enum', 'pipe', 'service'];

const generateEntity = (type, name) => {
  const command = `ng generate ${type} ${name}`;

  try {
    execSync(command, { stdio: 'inherit' });

    console.log(`${type} ${name} created successfully!`);
  } catch (error) {
    console.error(`error creating ${type}: ${error}`);
  }
};

const showMenu = () => {
  const questions = [
    {
      type: 'list',
      name: 'command',
      message: 'Choose a entity:',
      choices: [
        { name: 'Component', value: 'component' },
        { name: 'Interface', value: 'interface' },
        { name: 'Directive', value: 'directive' },
        { name: 'Module', value: 'module' },
        { name: 'Guard', value: 'guard' },
        { name: 'Enum', value: 'enum' },
        { name: 'Pipe', value: 'pipe' },
        { name: 'Service', value: 'service' },
      ],
    },
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name or path (src/app/<folderName>/*/<entityName>):',
      validate: function (input) {
        if (!input) {
          return 'Please provide a name.';
        }
        return true;
      },
    },
  ];

  inquirer.prompt(questions).then(function (answers) {
    const { command, name } = answers;

    if (entities.includes(command)) {
      generateEntity(command, name);
    } else {
      console.error('Invalid entity.');
    }
  });
};

module.exports = {
  showMenu,
};

showMenu();

const fs = require('fs');
const inquirer = require('inquirer');
const questions = require('../questions/emails.js');
const sendEmails = require('./sendEmails.js');

const createConfigs = function () {
	inquirer.prompt(questions)
		.then((answers) => {
			const config = JSON.stringify(answers, null, 4);
			fs.writeFile('./config.json', config);
			sendEmails(answers);
		});
};

module.exports = createConfigs;
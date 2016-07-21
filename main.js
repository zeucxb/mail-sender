#!/usr/bin/env node
'use strict';

const fs = require('fs');
const inquirer = require('inquirer');

const createConfigs = require('./birl/createConfigs.js');
const sendEmails = require('./birl/sendEmails.js');

const settingsQuestions = require('./questions/settings.js');

fs.stat('./config.json', function(err, stat) {
	if(!stat) {
		createConfigs();
	} else {
		inquirer.prompt(settingsQuestions)
			.then((answers) => {
				if (answers.use) {
					const answers = require('./config.json');
					sendEmails(answers);
				} else {
					createConfigs();
				}
			});
	}
});
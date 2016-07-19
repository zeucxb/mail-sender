#!/usr/bin/env node
'use strict';

const nodemailer = require('nodemailer');
const fs = require('fs');
const inquirer = require('inquirer');
const ora = require('ora');
const spinner = ora({ color: 'yellow', text: 'Carregando ...'});

const questions = require('./questions/emails.js');

const emails = require('./emails.json');

inquirer.prompt(questions)
	.then((answers) => {
		const transport = nodemailer.createTransport({
			host: answers.host,
			port: answers.port,
			// secure: true,
			auth: {
				user: answers.email,
				pass: answers.pass
			},
			tls: {
				rejectUnauthorized: false
			}
		});

		spinner.start();

		transport.verify(function(error, success) {
			if(success) {
				spinner.text = 'Enviando...';

				const config = {
					from: `${answers.from} <${answers.email}>`,
					subject: answers.subject
				};

				fs.readFile('./template.html', function (err, html) {
					if (err) throw err;

					if(emails.length > 0) {
						let i = 0;
						let j = 0;

						emails.map(e => {
							transport.sendMail({
								from: config.from,
								to: e.email,
								subject: config.subject,
								html
							}, (err) => {
								i++;

								if (!err) {
									spinner.text = `Email enviado para ${e.email}`;
									j++;
								}
								
								if (i == emails.length) {
									spinner.stop();
									
									console.log('%s email(s) enviados com sucesso.', j);
								}
							});
						});
					} else {
						spinner.stop();
						console.log('Nenhum email na lista.');
					}
				});
			} else {
				spinner.stop();
				console.log('Problemas com o servidor, verifique as informações fornecidas.');
				console.log('Se estiverem corretas tente usar smtpi (smtpi.site.com).');
			}
		});
	});
const fs = require('fs');
const nodemailer = require('nodemailer');
const ora = require('ora');
const spinner = ora({ color: 'yellow', text: 'Carregando ...'});
const jade = require('jade');

const emails = require('../emails.json');

const sendEmails = (answers) => {
	const templateCompile = jade.compileFile(`views/${answers.view}.jade`);
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

	transport.verify((error, success) => {
		if (success) {
			spinner.text = 'Carregando...';

			if (emails.length) {
				let i = 0;
				let j = 0;

				emails
					.map(email => {
						let attachments = (email.attachments || [])
							.map(x => {
								let attachPath = `attachments/${x}`;

								fs.statSync(attachPath).isFile();

								return {
									filename: x,
									content: fs.createReadStream(attachPath)
								};
							})
							.filter(x => x);

						return Object.assign(email, {
							attachments
						});
					})
					.forEach(email => {
						spinner.text = `Enviando email para ${email.email}...`;

						transport.sendMail({
							from: `${answers.from} <${answers.email}>`,
							to: email.email,
							subject: answers.subject,
							html: templateCompile(email),
							attachments: email.attachments
						}, (err) => {
							i++;

							if (!err) {
								spinner.text = `Email enviado para ${email.email}`;
								j++;
							}

							if (i === emails.length) {
								spinner.stop();
								console.log('%s email(s) enviados com sucesso.', j);
							}
						});
					});
			} else {
				spinner.stop();
				console.log('Nenhum email na lista.');
			}
		} else {
			spinner.stop();
			console.log('Problemas com o servidor, verifique as informações fornecidas e/ou a conexão com a internet.');
			console.log('Se estiverem corretas tente usar smtpi (smtpi.site.com).');
		}
	});
};

module.exports = sendEmails;

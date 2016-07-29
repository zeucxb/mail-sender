const fs = require('fs');
const nodemailer = require('nodemailer');
const ora = require('ora');
const spinner = ora({ color: 'yellow', text: 'Carregando ...'});

const emails = require('../emails.json');

const sendEmails = function (answers) {
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
						let attachments = (e.attachments || [])
							.map(x => {
								let attachPath = `attachments/${x}`;

								try {
									fs.statSync(attachPath).isFile();
								} catch (err) {
									if (err.code === 'ENOENT') {
										console.error(`[${e.email}] Attachment '${x}' does not exist. Please fix it.`);
										return;
									}

									throw err;
								}

								return {
									filename: x,
									content: fs.createReadStream(attachPath)
								};
							})
							.filter(x => x);

						transport.sendMail({
							from: config.from,
							to: e.email,
							subject: config.subject,
							html,
							attachments: attachments
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
			console.log('Problemas com o servidor, verifique as informações fornecidas e/ou a conexão com a internet.');
			console.log('Se estiverem corretas tente usar smtpi (smtpi.site.com).');
		}
	});
};

module.exports = sendEmails;

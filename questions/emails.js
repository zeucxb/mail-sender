const questions = [
    {
      	type: 'input',
      	name: 'host',
      	message: 'Qual seu host smtp?',
      	default: 'smtp.site.com'
    },
    {
      	type: 'input',
      	name: 'port',
      	message: 'Qual porta seu host smtp utiliza?',
      	default: '587'
    },
    {
      	type: 'input',
      	name: 'email',
      	message: 'Qual seu email?',
      	default: 'voce@site.com'
    },
    {
      	type: 'password',
      	name: 'pass',
      	message: 'Qual sua senha?'
    },
    {
      	type: 'input',
      	name: 'from',
      	message: 'Quem está enviando esse email?',
      	default: 'Seu Nome'
    },
    {
      	type: 'input',
      	name: 'subject',
      	message: 'Qual o assunto?',
      	default: 'Assunto'
    },
];

module.exports = questions;
const fs = require('fs');

const accountCreation = (name, url) => {
	let html = fs.readFileSync('./mailTemplates/accountCreation.html', 'utf-8');
	html = html.replace('linkToConfirmMail', url);
	html = html.replace('NAME', name);
	return {
		subject: 'Regarding Your Account Creation For Testify',
		html
	};
};

module.exports = {
	accountCreation
};

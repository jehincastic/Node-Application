const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.mail,
		pass: process.env.pass
	}
});

const sendMail = (emails, subject, html) => {
	return new Promise((resolve, reject) => {
		const mailOptions = {
			from: process.env.mail,
			to: emails,
			subject: subject,
			html: html
		};

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				reject(err);
			} else {
				resolve(info);
			}
		});
	});
};

module.exports = {
	sendMail
};

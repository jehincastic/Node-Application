const express = require('express'),
	router = express.Router();

const keyGeneration = require('../controllers/keyGeneration'),
	{ successResponse, failureResponse } = require('../controllers/response'),
	{ sendMail } = require('../controllers/sendMail'),
	{ accountCreation } = require('../controllers/mailContents'),
	User = require('../models/user'),
	{ validation } = require("../controllers/validator"),
	UserSession = require('../models/userSeesion');

const userSessionGenerator = (user, res) => {
	const userSession = new UserSession({
		userId: user['_id'],
		sessionId: keyGeneration.sessionIdGenerator(),
		loggedInTime: new Date()
	});
	userSession.save()
		.then(result => {
			const responseData = {
				_id: user['_id'],
				name: user['name'],
				email: user['email'],
				sessionId: result['sessionId']
			};
			successResponse(res, responseData);
		})
		.catch(err => {
			failureResponse(res, err);
		});
};

router.post('/register', (req, res) => {
	try {
		let valid = validation(req.body);
		if (valid.isValid) {
			let { name, email, phoneNumber, password } = req.body;
			password = keyGeneration.encryptPassword(password);
			let { secretKeyEmail } = keyGeneration.emailValidator();
			let { secretKeyPhone } = keyGeneration.phoneValidator();
			let secretKeyPhoneValidUntil = keyGeneration.timeStampGeneration(12);
			let secretKeyEmailValidUntil = secretKeyPhoneValidUntil;
			let { subject, html } = accountCreation(
				name,
				`http://localhost:4000/validate?key=${secretKeyEmail}`
			);
			const newUser = new User({
				name,
				email,
				password,
				phoneNumber,
				secretKeyEmail,
				secretKeyPhone,
				secretKeyEmailValidUntil,
				secretKeyPhoneValidUntil
			});
			newUser.save()
				.then(user => {
					sendMail(email, subject, html)
						.then(info => {
							userSessionGenerator(user, res);
						})
						.catch(err => {
							failureResponse(res, err);
						});
				})
				.catch(err => {
					failureResponse(res, err);
				});
		} else {
			failureResponse(res, valid.message);
		}
	} catch (err) {
		failureResponse(res, err);
	}
});

router.post('/login', (req, res) => {
	let valid = validation(req.body);
	if (valid.isValid) {
		let errorMessage = 'Email / Password Invalid';
		let { email, password } = req.body;
		User.findOne({ email })
			.exec()
			.then(user => {
				if (user) {
					const passwordValid = keyGeneration.passwordCheck(password, user.password);
					if (passwordValid) {
						userSessionGenerator(user, res);
					} else {
						failureResponse(res, { message: errorMessage });
					}
				} else {
					failureResponse(res, { message: errorMessage });
				}
			})
			.catch(err => {
				failureResponse(res, err);
			});
	} else {
		failureResponse(res, valid.message);
	}
});

module.exports = router;

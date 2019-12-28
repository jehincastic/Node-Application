const express = require('express'),
	router = express.Router();

const keyGeneration = require('../methods/keyGeneration'),
	{ failureResponse, successResponse } = require('../methods/response'),
	{ sendMail } = require('../methods/sendMail'),
	{ accountCreation } = require('../methods/mailContents'),
	User = require('../models/user'),
	Usersession = require("../models/userSession"),
	{ validation } = require("../methods/validator"),
	getCookie = require("../methods/cookie"),
	{ sessionGeneratorRegister, sessionGeneratorLogin } = require("../methods/session");
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
							sessionGeneratorRegister(user, res);
						})
						.catch(err => {
							failureResponse(res, err);
						});
				})
				.catch(err => {
					let errMsg = err;
					if (err.message) {
						err.message.includes("duplicate key error");
						errMsg = err.message.includes("duplicate key error") ? err.message.includes("email") ? "Email Already Registred" : "Phone Number Already Registred" : err;
					}
					failureResponse(res, errMsg);
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
						sessionGeneratorLogin(user, res);
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

router.post('/fetchUserInfo', (req, res) => {
	if (req.headers.hasOwnProperty("cookie")) {
		try {
			const sessionId = getCookie('sessionId', req.headers.cookie);
			Usersession.aggregate([
				{
					$match: {
						sessionId: sessionId
					}
				},{
					$lookup: {
						from: "users",
						localField: "userId",
						foreignField: "_id",
						as: "userInfo"
					}
				}
			]).exec((err, data) => {
				if (err) {
					failureResponse(res, err);
				} else if (data.length > 0) {
					if (!data[0].expired) {
						const user = data[0]["userInfo"][0];
						const userInfo = {
							_id: user['_id'],
							name: user['name'],
							email: user['email']
						}
						successResponse(res, userInfo);
					} else {
						failureResponse(res, {message: "Session Expired"})
					}
				} else {
					failureResponse(res, {message: "Invalid Session Id"});
				}
			})
		} catch (err) {
			failureResponse(res, err);
		}
	} else {
		failureResponse(res, {message: "No Cookies Present"})
	}
});

module.exports = router;

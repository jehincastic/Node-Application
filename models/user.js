const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			unique: true,
			required: true
		},
		phoneNumber: {
			type: Number,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		emailIsValidated: {
			type: Boolean,
			default: false
		},
		phoneIsValidated: {
			type: Boolean,
			default: false
		},
		secretKeyPhone: {
			type: Number,
			required: true
		},
		secretKeyEmail: {
			type: String,
			required: true
		},
		resetPasswordKey: {
			type: String
		},
		otp: {
			type: String
		},
		otpValidUntil: {
			type: Date
		},
		resetPasswordKeyValidUntil: {
			type: Date
		},
		secretKeyEmailValidUntil: {
			type: Date,
			required: true
		},
		secretKeyPhoneValidUntil: {
			type: Date,
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

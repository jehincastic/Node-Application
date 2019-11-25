const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	sessionId: {
		type: String,
		unique: true,
		required: true
	},
	expired: {
		type: Boolean,
		default: false
	},
	loggedInTime: {
		type: Date,
		required: true
	},
	loggedOutTime: {
		type: Date
	},
	loggedOutMode: {
		type: String
	}
});

module.exports = mongoose.model('UserSession', UserSessionSchema);

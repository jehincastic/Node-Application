const uuid4 = require('uuid/v4'),
	uuid1 = require('uuid/v1'),
	bcrypt = require('bcryptjs');

const emailValidator = () => {
	return {
		secretKeyEmail: uuid4()
	};
};

const sessionIdGenerator = () => uuid1();

const phoneValidator = () => {
	return {
		secretKeyPhone: Math.floor(1000 + Math.random() * 9000)
	};
};

const encryptPassword = password => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};

const passwordCheck = (password, hash) => {
	return bcrypt.compareSync(password, hash);
};

const timeStampGeneration = (timeToBeAdded = 0) => {
	const currentDate = new Date();
	currentDate.setHours(currentDate.getHours() + timeToBeAdded);
	return currentDate;
};

module.exports = {
	emailValidator,
	phoneValidator,
	encryptPassword,
	timeStampGeneration,
	passwordCheck,
	sessionIdGenerator
};

const validateEmail = email => {
	const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email);
};

const validatePhone = phone => {
	const re = /^[6789]\d{9}$/;
	return re.test(phone);
};

const checkIsEmpty = field => {
	if (field && field.trim('')) {
		return true;
	} else {
		return false;
	}
};

const validation = data => {
	let isValid = true;
	let msg = '';
	for (let key in data) {
		if (isValid) {
			if (key === 'phoneNumber') {
				isValid = validatePhone(data[key]);
				msg = isValid ? '' : 'Invalid Phone Number';
			} else if (key === 'email') {
				isValid = validateEmail(data[key]);
				msg = isValid ? '' : 'Invalid Email Address';
			} else {
				isValid = checkIsEmpty(data[key]);
				msg = isValid ? '' : `${key.toUpperCase()} can't be empty`;
			}
		} else {
			return {
				isValid,
				message: msg
			};
		}
	}
	return {
		isValid,
		message: msg
	};
};

module.exports = {
	validation
};

module.exports = {
	successResponse: (res, msg) => {
		res.send({
			status: 'SUCCESS',
			data: msg
		});
	},
	failureResponse: (res, err) => {
		res.send({
			status: 'FAILED',
			message: err.message || err
		});
	}
};

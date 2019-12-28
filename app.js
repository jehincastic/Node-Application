const express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	path = require('path'),
	app = express();

require('dotenv').config();

const indexRoutes = require('./routes/index'),
	{ scheduler } = require("./schedulers/scheduler");

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.dbLink, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("MongoDB Connected Successfully.....");
		// scheduler();
	})
	.catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('*', function(req, res, next) {
	if (!req.path.includes('api')) {
		res.sendFile(path.join(__dirname, 'index.html'), err => {
			if (err) {
				res.status(500).send(err);
			}
		});
	} else {
		next();
	}
});
app.use('/api', indexRoutes);
app.use('/*', (req, res) => {
	res.status(404).send({
		status: 'FAILED',
		message: 'Not Found'
	});
});

app.listen(process.env.port, () => {
	console.log(`Server is running in port ${process.env.port}`);
});

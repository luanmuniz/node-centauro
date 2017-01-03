'use strict';

try {
	module.exports = require('./config.json');
} catch (e) {
	module.exports = {
		"partnerName": process.env.partnerName,
		"partnerID": process.env.partnerID,
		"campaign": process.env.campaign,
		"password": process.env.password
	};
}

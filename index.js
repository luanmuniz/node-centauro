'use strict';

var catalogAPI = require('./lib/catalog'),
	errorHelper = require('./lib/error'),
	coreAPI = require('./lib/core'),
centauroAPI = {

	init: function(keys, env) {
		if(!keys || !keys.token || !keys.campaign || !keys.partnerID) {
			return errorHelper.errorHandler('main', 1);
		}

		centauroAPI = coreAPI.init(keys, env);

		if(keys.partnerName) {
			centauroAPI.catalog = catalogAPI.init(keys.partnerName, env);
		}

		return centauroAPI;
	}
};

module.exports = Object.create(centauroAPI);
'use strict';

var catalogAPI = require('./lib/catalog'),
	coreAPI = require('./lib/api/core'),
	skuAPI = require('./lib/api/sku'),
	trackingAPI = require('./lib/api/tracking'),
	orderAPI = require('./lib/api/order');

module.exports = function(keys, env) {
	var centauroCore = coreAPI.init(keys, env);

	this.sku = skuAPI.init(centauroCore);
	this.tracking = trackingAPI.init(centauroCore);
	this.order = orderAPI.init(centauroCore);

	if(keys.partnerName) {
		this.catalog = catalogAPI.init(keys.partnerName, env);
	}

	return this;
};
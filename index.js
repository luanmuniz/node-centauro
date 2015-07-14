'use strict';

var catalogAPI = require('./lib/catalog'),
	coreAPI = require('./lib/api/core'),
	skuAPI = require('./lib/api/sku');

module.exports = function(keys, env) {
	var centauroCore = coreAPI.init(keys, env);

	this.sku = skuAPI.init(centauroCore);
	if(keys.partnerName) {
		this.catalog = catalogAPI.init(keys.partnerName, env);
	}

	return this;
};
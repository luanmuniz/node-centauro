'use strict';

var catalogHelper = require('./helper'),
	errorHelper = require('../error'),
catalogAPI = {

	init: function(partnerName, env) {
		if(!partnerName) {
			return errorHelper.errorHandler('main', 1);
		}

		catalogHelper = catalogHelper.init(partnerName, env);
		return catalogAPI;
	},

	getFullCatalog: function() {
		return catalogHelper.makeRequest('full').then(function(json) {
			return catalogHelper.parseProductObj(json);
		});
	},

	getPartialCatalog: function() {
		return catalogHelper.makeRequest('partial').then(function(json) {
			return catalogHelper.parseProductObj(json);
		});
	},

	getStockAvailability: function() {
		return catalogHelper.makeRequest('stock').then(function(json) {
			var resultJson = [];

			if(!json.DisponibilidadeEstoque.Sku) {
				return errorHelper.errorHandler('parse', 2);
			}

			json.DisponibilidadeEstoque.Sku.forEach(function(sku) {
				var skuObj = sku['$'],
					skuResult = {};

				skuResult.id = skuObj.Sku;
				skuResult.avaliable = parseInt(skuObj.Disponivel, 10);
				skuResult.price = parseFloat(skuObj.Preco.replace(',', '.'));

				if(skuObj.PrecoDe) {
					skuResult.priceFrom = parseFloat(skuObj.PrecoDe.replace(',', '.'));
				}

				resultJson.push(skuResult);
			});

			return resultJson;
		});
	}

};

module.exports = Object.create(catalogAPI);
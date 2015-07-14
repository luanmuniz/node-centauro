'use strict';

var catalogHelper = require('./helper'),
	errorHelper = require('../helper'),
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
	},

	getCategoryTree: function() {
		return catalogHelper.makeRequest('category').then(function(json) {
			var resultJson = [];

			if(!json.ArvoreCategorias) {
				return errorHelper.errorHandler('parse', 3);
			}

			json.ArvoreCategorias.Grupo.forEach(function(group) {
				var groupObj = group['$'],
					groupResult = {};

				groupResult.id = groupObj.Id;
				groupResult.nome = groupObj.Nome.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
					return a.toUpperCase();
				});

				groupResult.subGroup = [];
				(group.SubGrupo || []).forEach(function(subGroup) {
					var subGroupObj = subGroup['$'],
						subGroupResult = {};

					subGroupResult.id = subGroupObj.Id;
					subGroupResult.nome = subGroupObj.Nome.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
						return a.toUpperCase();
					});

					subGroupResult.categories = [];
					(subGroup.Categoria || []).forEach(function(category) {
						var categoryObj = category['$'],
							categoryResult = {};

						categoryResult.id = categoryObj.Id;
						categoryResult.nome = categoryObj.Nome.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
							return a.toUpperCase();
						});

						subGroupResult.categories.push(categoryResult);
					});

					groupResult.subGroup.push(subGroupResult);
				});

				resultJson.push(groupResult);
			});

			return resultJson;
		});
	}

};

module.exports = Object.create(catalogAPI);
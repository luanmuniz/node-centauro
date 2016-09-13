'use strict';

var catalogHelper = require('./helper'),
	errorHelper = require('../helper'),
	catalogAPI;

catalogAPI = {

	init(partnerName, env) {
		if(!partnerName) {
			return errorHelper.errorHandler('main', 1);
		}

		catalogHelper = catalogHelper.init(partnerName, env);
		return catalogAPI;
	},

	getFullCatalog() {
		return catalogHelper.makeRequest('full').then(function(json) {
			return catalogHelper.parseProductObj(json);
		});
	},

	getPartialCatalog() {
		return catalogHelper.makeRequest('partial').then(function(json) {
			return catalogHelper.parseProductObj(json);
		});
	},

	getStockAvailability() {
		return catalogHelper.makeRequest('stock').then(function(json) {
			var jsonToReturn = [];

			if(!json.DisponibilidadeEstoque.Sku) {
				return errorHelper.errorHandler('parse', 2);
			}

			json.DisponibilidadeEstoque.Sku.forEach(function(sku) {
				var skuObj = sku.$,
					skuResult = {};

				skuResult.id = skuObj.Sku;
				skuResult.avaliable = parseInt(skuObj.Disponivel, 10);
				skuResult.price = parseFloat(skuObj.Preco.replace(',', '.'));

				if(skuObj.PrecoDe) {
					skuResult.priceFrom = parseFloat(skuObj.PrecoDe.replace(',', '.'));
				}

				jsonToReturn.push(skuResult);
			});

			return jsonToReturn;
		});
	},

	getCategoryTree() {
		return catalogHelper.makeRequest('category').then(function(categoryJson) {
			var jsonToReturn = [];

			if(!categoryJson.ArvoreCategorias) {
				return errorHelper.errorHandler('parse', 3);
			}

			categoryJson.ArvoreCategorias.Grupo.forEach((group) => {
				var groupObj = group.$,
					groupResult = {};

				groupResult.id = groupObj.Id;
				groupResult.nome = groupObj.Nome.toLowerCase().replace(/(?:^|\s)\S/g, function(firstChar) {
					return firstChar.toUpperCase();
				});

				groupResult.subGroup = catalogAPI.subGroupRender(group);
				jsonToReturn.push(groupResult);
			});

			return jsonToReturn;
		});
	},

	subGroupRender(group) {
		var subGroupArray = [];

		(group.SubGrupo || []).forEach((subGroup) => {
			var subGroupObj = subGroup.$,
				subGroupResult = {};

			subGroupResult.id = subGroupObj.Id;
			subGroupResult.nome = subGroupObj.Nome.toLowerCase().replace(/(?:^|\s)\S/g, function(firstChar) {
				return firstChar.toUpperCase();
			});

			subGroupResult.categories = [];
			(subGroup.Categoria || []).forEach((category) => {
				var categoryObj = category.$,
					categoryResult = {};

				categoryResult.id = categoryObj.Id;
				categoryResult.nome = categoryObj.Nome.toLowerCase().replace(/(?:^|\s)\S/g, function(firstChar) {
					return firstChar.toUpperCase();
				});

				subGroupResult.categories.push(categoryResult);
			});

			subGroupArray.push(subGroupResult);
		});

		return subGroupArray;
	}

};

module.exports = Object.create(catalogAPI);

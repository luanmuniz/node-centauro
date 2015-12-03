'use strict';

var centauroAPI, trackingAPI = {

	init: function(core) {
		centauroAPI = core;
		return trackingAPI;
	},

	checkTrackingValue: function(cepNumber, products) {
		var productList = [];

		products.forEach(function(el) {
			productList.push({
				ConsultarFreteDTO: {
					Quantidade: 1,
					Similar: false,
					Sku: el
				}
			});
		});

		return centauroAPI.makeRequest('ConsultarFrete', {
			idCampanha: '',
			chave: '',
			cep: cepNumber,
			dadosConsultarFrete: productList
		}, 'Frete').then(function(result) {
			var returnedObj = [];

			if(result.Erro) {
				return centauroAPI.errorHandler('tracking', result.CodigoErro, result);
			}

			if(result.Itens['ConsultarFreteSkuDTO.FreteSkuDTO']) {
				result.Itens = result.Itens['ConsultarFreteSkuDTO.FreteSkuDTO'];
			}

			if(!Array.isArray(result.Itens)) {
				result.Itens = [result.Itens];
			}

			result.Itens.forEach(function(el) {
				returnedObj.push({
					sku: el.Sku,
					value: parseFloat(el.ValorFrete),
					quantity: parseInt(el.Quantidade, 10),
					eta: el.PrevisaoEntrega.replace(' dias úteis', ''),
				});
			})

			return returnedObj;
		});
	}

};

module.exports = Object.create(trackingAPI)
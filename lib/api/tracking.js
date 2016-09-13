'use strict';

var centauroAPI, trackingAPI;

trackingAPI = {

	init(core) {
		centauroAPI = core;
		return trackingAPI;
	},

	checkTrackingValue(cepNumber, products) {
		var productList = [];

		products.forEach((el) => {
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
		}, 'Frete').then((freteResult) => {
			var returnedObj = [];

			if(freteResult.Erro) {
				return centauroAPI.errorHandler('tracking', freteResult.CodigoErro, freteResult);
			}

			if(freteResult.Itens['ConsultarFreteSkuDTO.FreteSkuDTO']) {
				freteResult.Itens = freteResult.Itens['ConsultarFreteSkuDTO.FreteSkuDTO'];
			}

			if(!Array.isArray(freteResult.Itens)) {
				freteResult.Itens = [ freteResult.Itens ];
			}

			freteResult.Itens.forEach((el) => {
				returnedObj.push({
					sku: el.Sku,
					value: parseFloat(el.ValorFrete),
					quantity: parseInt(el.Quantidade, 10),
					eta: el.PrevisaoEntrega.replace(' dias úteis', '')
				});
			});

			return returnedObj;
		});
	}

};

module.exports = Object.create(trackingAPI);

'use strict';

var centauroAPI, skuAPI = {

	init: function(core) {
		centauroAPI = core;
		return skuAPI;
	},

	consultSku: function(skuList) {
		if(!Array.isArray(skuList) || skuList.length === 0) {
			centauroAPI.errorHandler('sku', 1);
		}

		var skuFullList = [];
		skuList.forEach(function(el) {
			skuFullList.push({
				'DadosConsultarSkuDTO.ConsultarSkuDTO': {
					Quantidade: 1,
					Similar: false,
					Sku: el
				}
			});
		});

		return centauroAPI.makeRequest('ConsultarSku', {
			dadosConsultarSkuDTO: {
				CNPJ: centauroAPI.helper.formatCNPJ(centauroAPI.keys.password),
				Chave: '',
				IdCampanha: '',
				Sku: skuFullList
			}
		}, 'Produto');
	}

};

module.exports = skuAPI;
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
					'byt:Sku': el,
					'byt:Similar': false,
					'byt:Quantidade': 1
				}
			});
		});

		return centauroAPI.makeRequest('ConsultarSku', {
			dadosConsultarSkuDTO: {
				CNPJ: centauroAPI.helper.formatCNPJ(centauroAPI.keys.password)
			}
		});
	}

};

module.exports = skuAPI;
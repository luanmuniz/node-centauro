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
		}, 'Produto').then(function(result) {
			if(result.Erro) {
				return centauroAPI.errorHandler('sku', result.CodigoErro, result);
			}

			var skuList = []
			result.Skus['ConsultarSkuDTO.SkuConsultaDTO'].forEach(function(el) {
				skuList.push({
					category: el.Categoria,
					description: el.Descricao,
					avaliable: el.Disponivel,
					atline: el.EmLinha,
					shipment: el.FretePonderado,
					image: el.Imagem,
					title: el.Nome,
					price: el.Preco,
					priceFrom: el.PrecoDe,
					id: el.Sku
				});
			});

			return Promise.resolve(skuList)
		});
	}

};

module.exports = skuAPI;
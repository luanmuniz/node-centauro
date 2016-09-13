'use strict';

var centauroAPI, skuAPI;

skuAPI = {

	init(core) {
		centauroAPI = core;
		return skuAPI;
	},

	consultSku(skuList) {
		if(!Array.isArray(skuList) || skuList.length === 0) {
			centauroAPI.errorHandler('sku', 1);
		}

		var skuFullList = [];

		skuList.forEach((el) => {
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
		}, 'Produto').then((skuResult) => {
			var skuListResult = [];

			if(skuResult.Erro) {
				return centauroAPI.errorHandler('sku', skuResult.CodigoErro, skuResult);
			}

			skuResult.Skus['ConsultarSkuDTO.SkuConsultaDTO'].forEach((el) => {
				skuListResult.push({
					category: el.Categoria,
					description: el.Descricao,
					avaliable: el.Disponivel,
					atline: el.EmLinha,
					shipment: el.FretePonderado,
					image: el.Imagem,
					title: el.Nome,
					price: parseFloat(el.Preco),
					priceFrom: parseFloat(el.PrecoDe),
					id: el.Sku
				});
			});

			return Promise.resolve(skuListResult);
		});
	}

};

module.exports = skuAPI;

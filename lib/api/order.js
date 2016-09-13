'use strict';

var centauroAPI, orderAPI;

orderAPI = {

	init(core) {
		centauroAPI = core;
		return orderAPI;
	},

	confirmOrder(orderId, partnerId) {
		return centauroAPI.makeRequest('ConfirmarPedido', {
			confirmarPedido: {
				CNPJ: centauroAPI.helper.formatCNPJ(centauroAPI.keys.password),
				Chave: '',
				IdCampanha: '',
				IdCompra: orderId,
				PedidoParceiro: partnerId
			}
		}, 'Pedido').then((pedidoResult) => {
			if(pedidoResult.Erro) {
				return centauroAPI.errorHandler('order', pedidoResult.CodigoErro, pedidoResult);
			}

			return { confirmed: pedidoResult.Confirmado };
		});
	},

	getOrder(orderId) {
		return centauroAPI.makeRequest('ConsultarPedidoParceiro', {
			idCampanha: '',
			idPedidoExternoParceiro: orderId,
			chave: ''
		}, false).then(function(pedidoResult) {
			var referencia = '';

			if(pedidoResult.Erro) {
				return centauroAPI.errorHandler('order', pedidoResult.CodigoErro, pedidoResult);
			}

			if(pedidoResult.Endereco.Referencia !== '?' || !pedidoResult.Endereco.Referencia) {
				referencia = pedidoResult.Endereco.Referencia;
			}

			return {
				user: {
					cpf: pedidoResult.Destinatario.CpfCnpj,
					name: pedidoResult.Destinatario.Nome
				},
				address: {
					neighborhood: pedidoResult.Endereco.Bairro,
					cep: pedidoResult.Endereco.CEP,
					city: pedidoResult.Endereco.Cidade,
					complement: pedidoResult.Endereco.Complemento,
					state: pedidoResult.Endereco.Estado,
					street: pedidoResult.Endereco.Logradouro,
					number: pedidoResult.Endereco.Numero,
					reference: referencia,
					phone: pedidoResult.Endereco.Telefone
				},
				order: {
					date: new Date(pedidoResult.Pedido.DataHora),
					id: pedidoResult.Pedido.IdCompra,
					partnerId: pedidoResult.Pedido.PedidoParceiro,
					eta: pedidoResult.Pedido.PrevisaoEntrega,
					productsValue: parseFloat(pedidoResult.Pedido.ValorSkus),
					deliveryValue: parseFloat(pedidoResult.Pedido.ValorFrete),
					total: parseFloat(pedidoResult.Pedido.ValorTotalCompra)
				},
				products: {
					quantity: parseInt(pedidoResult.Skus.SkuPedidoParceiroDTO.Quantidade, 10),
					sku: pedidoResult.Skus.SkuPedidoParceiroDTO.Sku,
					deliveryDate: new Date(pedidoResult.Skus.SkuPedidoParceiroDTO.PrevisaoEntrega)
				}
			};
		});
	},

	createOrder(orderObj) {
		var productList = [],
			freteValue = 0,
			freteVerify = true,
			waitConfirmation = true;

		if(!Array.isArray(orderObj.produto)) {
			orderObj.produto = [ orderObj.produto ];
		}

		orderObj.produto.forEach((el) => {
			productList.push({
				ProdutoPedidoDTO: {
					PrecoVenda: el.value,
					Quantidade: 1,
					Similar: false,
					Sku: el.skuId
				}
			});
		});

		if(orderObj.frete) {
			freteValue = orderObj.frete;
			freteVerify = false;
		}

		if(orderObj.waitConfirmation) {
			waitConfirmation = false;
		}

		return centauroAPI.makeRequest('CriarPedido', {
			dadosPedidoDTO: {
				AguardarConfirmacao: waitConfirmation,
				CNPJ: centauroAPI.helper.formatCNPJ(centauroAPI.keys.password),
				Chave: '',
				CodigoPedidoExternoParceiro: orderObj.id,
				Destinatario: {
					CpfCnpj: orderObj.user.cpf,
					Email: orderObj.user.email,
					Nome: orderObj.user.name
				},
				EnderecoEntrega: {
					Bairro: orderObj.address.neighborhood,
					CEP: orderObj.address.cep,
					Cidade: orderObj.address.city,
					Complemento: (orderObj.address.complement || ''),
					Estado: orderObj.address.state,
					Logradouro: orderObj.address.street,
					Numero: orderObj.address.number,
					Referencia: '',
					Telefone: orderObj.address.phone.ddd + '' + orderObj.address.phone.number // eslint-disable-line prefer-template
				},
				IdCampanha: '',
				NaoCompararFrete: freteVerify,
				Produtos: productList,
				ValorFrete: freteValue
			}
		}, 'Pedido').then((pedidoResult) => {
			if(pedidoResult.Erro) {
				return centauroAPI.errorHandler('order', pedidoResult.CodigoErro, pedidoResult);
			}

			return {
				id: pedidoResult.IdCompra,
				partnerId: pedidoResult.PedidoParceiro,
				waitConfirmation: pedidoResult.AguardarConfirmacao,
				eta: pedidoResult.PrazoEntrega,
				productsValue: parseFloat(pedidoResult.ValorSkusCompra),
				deliveryValue: parseFloat(pedidoResult.ValorFreteCompra),
				total: parseFloat(pedidoResult.ValorTotalCompra),
				products: [{
					sku: pedidoResult.Skus['PedidoDTO.SkuPedidoDTO'].Sku,
					value: parseFloat(pedidoResult.Skus['PedidoDTO.SkuPedidoDTO'].Valor),
					quantity: parseInt(pedidoResult.Skus['PedidoDTO.SkuPedidoDTO'].Quantidade, 10)
				}]
			};
		});
	}

};

module.exports = Object.create(orderAPI);

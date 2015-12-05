'use strict';

var centauroAPI, orderAPI = {

	init: function(core) {
		centauroAPI = core;
		return orderAPI;
	},

	confirmOrder: function(orderId, partnerId) {
		return centauroAPI.makeRequest('ConfirmarPedido', {
			confirmarPedido: {
				CNPJ: centauroAPI.helper.formatCNPJ(centauroAPI.keys.password),
				Chave: '',
				IdCampanha: '',
				IdCompra: orderId,
				PedidoParceiro: partnerId
			}
		}, 'Pedido').then(function(result) {

			if(result.Erro) {
				return centauroAPI.errorHandler('order', result.CodigoErro, result);
			}

			return { confirmed: result.Confirmado };
		});
	},

	getOrder: function(orderId) {
		return centauroAPI.makeRequest('ConsultarPedidoParceiro', {
			idCampanha: '',
			idPedidoExternoParceiro: orderId,
			chave: '',
		}, false).then(function(result) {
			var referencia = '';

			if(result.Erro) {
				return centauroAPI.errorHandler('order', result.CodigoErro, result);
			}

			if(result.Endereco.Referencia !== '?' || !result.Endereco.Referencia) {
				referencia = result.Endereco.Referencia;
			}

			return {
				user: {
					cpf: result.Destinatario.CpfCnpj,
					name: result.Destinatario.Nome
				},
				address: {
					neighborhood: result.Endereco.Bairro,
					cep: result.Endereco.CEP,
					city: result.Endereco.Cidade,
					complement: result.Endereco.Complemento,
					state: result.Endereco.Estado,
					street: result.Endereco.Logradouro,
					number: result.Endereco.Numero,
					reference: referencia,
					phone: result.Endereco.Telefone,
				},
				order: {
					date: new Date(result.Pedido.DataHora),
					id: result.Pedido.IdCompra,
					partnerId: result.Pedido.PedidoParceiro,
					eta: result.Pedido.PrevisaoEntrega,
					productsValue: parseFloat(result.Pedido.ValorSkus),
					deliveryValue: parseFloat(result.Pedido.ValorFrete),
					total: parseFloat(result.Pedido.ValorTotalCompra),
				},
				products: {
					quantity: parseInt(result.Skus.SkuPedidoParceiroDTO.Quantidade, 10),
					sku: result.Skus.SkuPedidoParceiroDTO.Sku,
					deliveryDate: new Date(result.Skus.SkuPedidoParceiroDTO.PrevisaoEntrega),
				}
			};
		});
	},

	createOrder: function(orderObj) {
		var productList = [],
			freteValue = 0,
			freteVerify = true,
			waitConfirmation = true;

		if(!Array.isArray(orderObj.produto)) {
			orderObj.produto = [orderObj.produto];
		}

		orderObj.produto.forEach(function(el) {
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
					Telefone: orderObj.address.phone.ddd + '' + orderObj.address.phone.number
				},
				IdCampanha: '',
				NaoCompararFrete: freteVerify,
				Produtos: productList,
				ValorFrete: freteValue,
			}
		}, 'Pedido').then(function(pedidoResult) {

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
				products:[{
					sku: pedidoResult.Skus['PedidoDTO.SkuPedidoDTO'].Sku,
					value: parseFloat(pedidoResult.Skus['PedidoDTO.SkuPedidoDTO'].Valor),
					quantity: parseInt(pedidoResult.Skus['PedidoDTO.SkuPedidoDTO'].Quantidade, 10)
				}]
			}
		});
	}

};

module.exports = Object.create(orderAPI)
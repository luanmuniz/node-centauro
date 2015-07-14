'use strict';

var Promise = require('promise'),
	soap = require('soap'),
	helper = require('../helper'),
centauroAPI = {

	url: 'http://wsb2b.centauro.com.br/FacadeB2B.svc?singleWsdl',
	keys: false,
	env: false,
	token: false,
	api: false,


	init: function(keys, env) {
		centauroAPI.keys = keys;
		if(env && env === 'development') {
			centauroAPI.url = centauroAPI.url.replace('wsb2b', 'qaswsb2b');
			centauroAPI.env = env;
		}

		if(!keys.password || !keys.partnerID) {
			return helper.errorHandler('core', 1);
		}

		return centauroAPI;
	},

	errorHandler: helper.errorHandler,
	helper: helper,

	makeRequest: function(method, params) {
		return centauroAPI.createToken().then(function() {
			var methodPromise = Promise.denodeify(centauroAPI.api[method]);

			params.dadosConsultarSkuDTO.Chave = centauroAPI.token.key;
			params.dadosConsultarSkuDTO.IdCampanha = centauroAPI.keys.campaign;

			return methodPromise(params);
		});
	},

	auth: function() {
		var soapPromise = Promise.denodeify(soap.createClient);

		return soapPromise(centauroAPI.url, {
			ignoredNamespaces: {
		        namespaces: ['tns', 'byt', 'tem'],
		        override: true
		    }
		})
			.then(function(client) {
				var AutenticaPromise = Promise.denodeify(client.Autentica);
				centauroAPI.api = client;

				return AutenticaPromise({
					idParceiro: centauroAPI.keys.partnerID,
					senha: centauroAPI.keys.password
				});
			})
			.then(function(result) {
				var result = result.AutenticaResult;

				if(helper.booleanParse(result.Erro)) {
					return helper.errorHandler('core', result.CodigoErro, result);
				}

				centauroAPI.token = {
					key: result.Chave,
					expire: result.DataExpiracao
				};

				return Promise.resolve(true);
			});
	},

	createToken: function(functionCall) {
		var dateNow = Date.now();

		if(!centauroAPI.keys) {
			return helper.errorHandler('core', 2);
		}

		if(centauroAPI.api && centauroAPI.token.expire >= dateNow) {
			return Promise.resolve(true);
		}

		return centauroAPI.auth();
	}

};

module.exports = Object.create(centauroAPI);
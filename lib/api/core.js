'use strict';

var Promise = require('promise'),
	soap = require('./soap'),
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
			centauroAPI.url = centauroAPI.url.replace('/wsb2b.', '/qaswsb2b.');
			centauroAPI.env = env;
		}

		if(!keys.password || !keys.partnerID) {
			return helper.errorHandler('core', 1);
		}

		return centauroAPI;
	},

	errorHandler: helper.errorHandler,
	helper: helper,

	makeRequest: function(method, params, schema) {
		return centauroAPI.createToken().then(function() {
			var paramValueName;

			if(params.Chave !== undefined) {
				params.Chave = centauroAPI.token.key;
				params.IdCampanha = centauroAPI.keys.campaign;
			}

			if(params.chave !== undefined) {
				params.chave = centauroAPI.token.key;
				params.idCampanha = centauroAPI.keys.campaign;
			}

			if(!params.chave && !params.Chave) {
				paramValueName = Object.keys(params).splice(0,1).join('');
				params[paramValueName].Chave = centauroAPI.token.key;
				params[paramValueName].IdCampanha = centauroAPI.keys.campaign;
			}

			return soap.request(method, params, schema);
		});
	},

	auth: function() {
		return soap.init(centauroAPI.url).request('Autentica', {
			idParceiro: centauroAPI.keys.partnerID,
			senha: centauroAPI.keys.password
		}).then(function(result) {
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
'use strict';

var soap = require('./soap'),
	helper = require('../helper'),
	centauroAPI;

centauroAPI = {

	url: 'http://wsb2b.centauro.com.br/v2/FacadeB2B.svc?singleWsdl',
	keys: false,
	env: false,
	token: false,
	api: false,


	init(keys, env) {
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
	helper: helper, // eslint-disable-line object-shorthand

	makeRequest(method, params, schema) {
		return centauroAPI.createToken().then(() => {
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
				paramValueName = Object.keys(params).splice(0, 1).join('');
				params[paramValueName].Chave = centauroAPI.token.key;
				params[paramValueName].IdCampanha = centauroAPI.keys.campaign;
			}

			return soap.request(method, params, schema);
		});
	},

	auth() {
		return soap.init(centauroAPI.url).request('Autentica', {
			idParceiro: centauroAPI.keys.partnerID,
			senha: centauroAPI.keys.password
		}).then(function(autenticaResult) {
			if(helper.booleanParse(autenticaResult.Erro)) {
				return helper.errorHandler('core', autenticaResult.CodigoErro, autenticaResult);
			}

			centauroAPI.token = {
				key: autenticaResult.Chave,
				expire: autenticaResult.DataExpiracao
			};

			return Promise.resolve(true);
		});
	},

	createToken() {
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

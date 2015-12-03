'use strict';

var errorAPI = {

	errorObj: {
		main: {
			0: 'Request Error',
			1: 'You need to pass your credentials to initialize the module',
			2: 'You need to initialize the module with your ID and Password'
		},

		product: {
			1: 'We cant find any products'
		},

		parse: {
			1: 'Products not found',
			2: 'Skus not found'
		},

		core: {
			1: 'You need to pass your credentials to initialize the module',
			2: 'You need to initialize the module with your ID and Password',
			'Obrigatorio': 'You need to pass your credentials to initialize the module',
			'ParceiroSenhaInvalida': 'Invalid password',
			'ParceiroNaoEncontrado': 'Partner not found',
			'ErroSistema': 'System error'
		},

		sku: {
			1: 'You need to pass an Array of ID\'s',
			'ChaveAcessoInvalida': 'A chave de acesso é inválida ou expirou.',
			'CampanhaInexistente': 'Campanha inexistente.',
			'CPFCNPJFormatoInvalido': 'CPF/CNPJ deve estar devidamente formatado.',
			'CNPJNaoPertenceACampanha': 'CNPJ não corresponde à campanha.',
			'CampanhaForaVigencia': 'Campanha fora de vigência.',
			'Obrigatorio': 'You need to pass all the required data',
			'NaoEncontrado': 'Sku não encontrado.',
			'ErroSistema': 'System error'
		},

		tracking: {
			1: 'You need to pass the order id',
			'Obrigatorio': 'You need to pass all the required data',
			'ErroSistema': 'System error'
		},

		order: {
			'ErroSistema': 'System error'
		}
	},

	errorHandler: function(section, code, err) {
		var returnedError = { success: false },
			message = 'Error Unknow';

		if(errorAPI.errorObj[section][code]) {
			message = errorAPI.errorObj[section][code];
		}

		returnedError.code = code;
		returnedError.message = message;

		if(err) {
			delete err.response;
			returnedError.err = err;
		}

		console.error(returnedError);
		throw new Error(returnedError.message);
	},

	booleanParse: function(string) {
		if(string === 'true') {
			return true;
		}

		return false;
	},

	formatCNPJ: function(cnpj) {
		var formatedCNPJ = '';

		formatedCNPJ += cnpj.substr(0,2) + '.';
		formatedCNPJ += cnpj.substr(2,3) + '.';
		formatedCNPJ += cnpj.substr(5,3) + '/';
		formatedCNPJ += cnpj.substr(8,4) + '-';
		formatedCNPJ += cnpj.substr(12,2);

		return formatedCNPJ;
	}

};

module.exports = Object.create(errorAPI);
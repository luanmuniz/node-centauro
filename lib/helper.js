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
			'ChaveAcessoInvalida': 'The access key is invalid or expired',
			'CampanhaInexistente': 'Nonexistent campaign',
			'CPFCNPJFormatoInvalido': 'CPF/CNPJ must be properly formatted',
			'CNPJNaoPertenceACampanha': 'CNPJ does not match the campaign',
			'CampanhaForaVigencia': 'This campaing is offline',
			'Obrigatorio': 'You need to pass all the required data',
			'NaoEncontrado': 'Sku not found',
			'ErroSistema': 'System error'
		},

		tracking: {
			1: 'You need to pass the order id',
			'ChaveAcessoInvalida': 'The access key is invalid or expired',
			'CampanhaInexistente': 'Nonexistent campaign',
			'CEPInvalido': 'CEP not found',
			'Obrigatorio': 'You need to pass all the required data',
			'NaoEncontrado': 'Sku not found',
			'ErroSistema': 'System error'
		},

		order: {
			'ChaveAcessoInvalida': 'The access key is invalid or expired',
			'CampanhaInexistente': 'Nonexistent campaign',
			'PedidoSemProduto': 'Sku not found',
			'CPFCNPJFormatoInvalido': 'CPF/CNPJ must be properly formatted',
			'CNPJNaoPertenceACampanha': 'CNPJ does not match the campaign',
			'CampanhaForaVigencia': 'This campaing is offline',
			'CEPInvalido': 'CEP not found',
			'MunicipioEstadoInvalido': 'State or City dont match the CEP',
			'NaoEncontrado': 'Sku not found',
			'PrecoVendaInvalido': 'The sale price reported for the product does not match the price registered in the system',
			'ProcessamentoDoPedido': 'Order not processed',
			'Obrigatorio': 'You need to pass all the required data',
			'ErroSistema': 'System error',
			'PedidoConfirmado': 'This order is already confirmed'
		}
	},

	errorHandler(section, code, errorResponse) {
		var returnedError = { success: false },
			message = 'Error Unknow';

		if(errorAPI.errorObj[section][code]) {
			message = errorAPI.errorObj[section][code];
		}

		returnedError.code = code;
		returnedError.message = message;

		if(errorResponse) {
			delete errorResponse.response;
			returnedError.errorResponse = errorResponse;
		}

		return Promise.reject(returnedError.message);
	},

	booleanParse(string) {
		return (string === 'true' || string === true);
	},

	formatCNPJ(cnpj) {
		var formatedCNPJ = '';

		formatedCNPJ += cnpj.substr(0, 2) + '.'; // eslint-disable-line prefer-template
		formatedCNPJ += cnpj.substr(2, 3) + '.'; // eslint-disable-line prefer-template
		formatedCNPJ += cnpj.substr(5, 3) + '/'; // eslint-disable-line prefer-template
		formatedCNPJ += cnpj.substr(8, 4) + '-'; // eslint-disable-line prefer-template
		formatedCNPJ += cnpj.substr(12, 2); // eslint-disable-line no-magic-numbers

		return formatedCNPJ;
	}

};

module.exports = Object.create(errorAPI);

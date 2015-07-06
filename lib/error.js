'use strict';

var errorAPI = {

	errorObj: {
		main: {
			0: 'Request Error',
			1: 'You need to pass your credentials to initialize the module.',
			2: 'You need to initialize the module with your ID and Secret.'
		},

		product: {
			1: 'We cant find any products'
		},

		parse: {
			1: 'Products not found',
			2: 'Skus not found'
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
			returnedError.err = err;
		}

		console.error(returnedError);
		throw new Error(returnedError.message);
	}

};

module.exports = Object.create(errorAPI);
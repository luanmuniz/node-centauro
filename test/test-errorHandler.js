'use strict';

var lib = require('../lib/helper'),
	should = require('should'),
	config = require('./config.js');

describe('Checking ErrorHandler', function() {
	this.timeout(15000);

	it('ConsultSkus', function(done) {
		lib.errorHandler('product', '1').catch((responseError) => {
			responseError.should.be.equal('We cant find any products');
			done();
		})
	});

});

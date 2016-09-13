'use strict';

var request = require('supertest'),
	Lib = require('../index'),
	should = require('should'),
	config = require('./config.js');

describe('Checking Tracking', function() {
	this.timeout(15000);
	it('Value', function(done) {
		var centauro = new Lib(config, 'development');

		centauro.catalog.getFullCatalog()
			.then(function (result) {
				var skuList = [];

				result.forEach(function(product) {
					if(skuList.length < 3) {
						skuList.push(product.skus[0].id);
					}
				});

				centauro.tracking
					.checkTrackingValue('08465312', skuList)
					.then(function(result) {
						result.should.be.a.Array();

						result[0].should.be.a.Object();
						result[0].should.have.property('sku').which.is.a.String();
						result[0].should.have.property('value').which.is.a.Number();
						result[0].should.have.property('quantity').which.is.a.Number();
						result[0].should.have.property('eta').which.is.a.String();

						done();
					});
			});
	});

});

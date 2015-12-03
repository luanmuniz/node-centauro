'use strict';

var request = require('supertest'),
	Lib = require('../index'),
	should = require('should'),
	config = require('./config.json');

describe('Checking Skus', function() {
	this.timeout(15000);

	it('ConsultSkus', function(done) {
		var centauro = new Lib(config, 'development');

		centauro.catalog.getFullCatalog().then(function(catalogResult) {
			var skuList = [];

			catalogResult.forEach(function(product) {
				if(skuList.length < 3) {
					skuList.push(product.skus[0].id);
				}
			});

			centauro.sku.consultSku(skuList).then(function(result) {
				result.should.be.a.Array();
				result.length.should.be.exactly(3);

				result[0].should.be.a.Object();
				result[0].should.have.property('category').which.is.a.String();
				result[0].should.have.property('description').which.is.a.String();
				result[0].should.have.property('avaliable').which.is.a.Boolean();
				result[0].should.have.property('atline').which.is.a.Boolean();
				result[0].should.have.property('shipment').which.is.a.String();
				result[0].should.have.property('image').which.is.a.String();
				result[0].should.have.property('title').which.is.a.String();
				result[0].should.have.property('price').which.is.a.Number();
				result[0].should.have.property('priceFrom').which.is.a.Number();
				result[0].should.have.property('id').which.is.a.String();

				done();
			})
		});
	});

});
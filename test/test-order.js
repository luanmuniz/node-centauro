'use strict';

var request = require('supertest'),
	Lib = require('../index'),
	should = require('should'),
	config = require('./config.json');

describe('Checking Orders', function() {
	this.timeout(15000);

	it('Creating order', function(done) {
		var centauro = new Lib(config, 'development'),
			skuPrice, skuId;

		centauro.catalog.getPartialCatalog()
		.then(function(catalogResult) {
			var skuToCheck = catalogResult[0].skus[0];
			skuPrice = 399.99; // On the QAS env they send the price wrong
			skuId = skuToCheck.id;
			return centauro.tracking.checkTrackingValue('08465312', [ skuToCheck.id ]);
		})
		.then(function(trackingObj) {
			return centauro.order.createOrder({
				produto: {
					value: skuPrice,
					skuId: skuId
				},
				id: 11122015001,
				user: {
					cpf: '62799249396',
					email: 'email@asd.com',
					name: 'Luan Muniz Teixeira'
				},
				address: {
					neighborhood: 'Jardim São Paulo',
					cep: '08465312',
					city: 'São Paulo',
					state: 'SP',
					street: 'Rua Quarenta e Sete',
					number: 23,
					phone: {
						ddd: 11,
						number: 999223442
					}
				}
			});
		})
		.then(function(orderResult) {
			orderResult.should.be.a.Object();
			orderResult.should.have.property('id').which.is.a.String();
			orderResult.should.have.property('partnerId').which.is.a.String();
			orderResult.should.have.property('waitConfirmation').which.is.a.Boolean();
			orderResult.should.have.property('eta').which.is.a.String();
			orderResult.should.have.property('productsValue').which.is.a.Number();
			orderResult.should.have.property('deliveryValue').which.is.a.Number();
			orderResult.should.have.property('total').which.is.a.Number();
			orderResult.should.have.property('products').which.is.a.Array();
			orderResult.products[0].should.have.property('sku').which.is.a.String();
			orderResult.products[0].should.have.property('value').which.is.a.Number();
			orderResult.products[0].should.have.property('quantity').which.is.a.Number();

			done();
		});
	});

	it('Getting order', function(done) {
		var centauro = new Lib(config, 'development'),
			skuPrice, skuId;

		centauro.catalog.getPartialCatalog().then(function(catalogResult) {
			var skuToCheck = catalogResult[0].skus[0];
			skuPrice = 399.99; // On the QAS env they send the price wrong
			skuId = skuToCheck.id;
			return centauro.tracking.checkTrackingValue('08465312', [skuToCheck.id]);
		}).then(function() {
			return centauro.order.createOrder({
				produto: {
					value: skuPrice,
					skuId: skuId
				},
				id: 11122015001,
				user: {
					cpf: '62799249396',
					email: 'email@asd.com',
					name: 'Luan Muniz Teixeira'
				},
				address: {
					neighborhood: 'Jardim São Paulo',
					cep: '08465312',
					city: 'São Paulo',
					state: 'SP',
					street: 'Rua Quarenta e Sete',
					number: 23,
					phone: {
						ddd: 11,
						number: 999223442
					}
				}
			});
		}).then(function(orderResult) {
			return centauro.order.getOrder(orderResult.partnerId);
		}).then(function(orderResult) {

			orderResult.should.be.a.Object();

			orderResult.should.have.property('user').which.is.a.Object();
			orderResult.user.should.have.property('cpf').which.is.a.String();
			orderResult.user.should.have.property('name').which.is.a.String();

			orderResult.should.have.property('address').which.is.a.Object();
			orderResult.address.should.have.property('neighborhood').which.is.a.String();
			orderResult.address.should.have.property('cep').which.is.a.String();
			orderResult.address.should.have.property('city').which.is.a.String();
			orderResult.address.should.have.property('complement').which.is.a.String();
			orderResult.address.should.have.property('state').which.is.a.String();
			orderResult.address.should.have.property('street').which.is.a.String();
			orderResult.address.should.have.property('number').which.is.a.String();
			orderResult.address.should.have.property('reference').which.is.a.String();
			orderResult.address.should.have.property('phone').which.is.a.String();

			orderResult.should.have.property('order').which.is.a.Object();
			orderResult.order.should.have.property('date');
			orderResult.order.should.have.property('id').which.is.a.String();
			orderResult.order.should.have.property('partnerId').which.is.a.String();
			orderResult.order.should.have.property('eta').which.is.a.String();
			orderResult.order.should.have.property('productsValue').which.is.a.Number();
			orderResult.order.should.have.property('deliveryValue').which.is.a.Number();
			orderResult.order.should.have.property('total').which.is.a.Number();

			orderResult.should.have.property('products').which.is.a.Object();
			orderResult.products.should.have.property('quantity').which.is.a.Number();
			orderResult.products.should.have.property('sku').which.is.a.String();
			orderResult.products.should.have.property('deliveryDate');

			done();
		});
	});

	it('Confirm Order', function(done) {
		var centauro = new Lib(config, 'development'),
			skuPrice, skuId;

		centauro.catalog.getPartialCatalog().then(function(catalogResult) {
			var skuToCheck = catalogResult[0].skus[0];
			skuPrice = 399.99; // On the QAS env they send the price wrong
			skuId = skuToCheck.id;
			return centauro.tracking.checkTrackingValue('08465312', [skuToCheck.id]);
		}).then(function(trackingObj) {
			return centauro.order.createOrder({
				produto: {
					value: skuPrice,
					skuId: skuId
				},
				id: 11122015001,
				user: {
					cpf: '62799249396',
					email: 'email@asd.com',
					name: 'Luan Muniz Teixeira'
				},
				address: {
					neighborhood: 'Jardim São Paulo',
					cep: '08465312',
					city: 'São Paulo',
					state: 'SP',
					street: 'Rua Quarenta e Sete',
					number: 23,
					phone: {
						ddd: 11,
						number: 999223442
					}
				}
			});
		}).then(function(orderResult) {
			return centauro.order.confirmOrder(orderResult.id, orderResult.partnerId);
		}).then(function(orderResult) {
			orderResult.should.be.a.Object();
			orderResult.should.have.property('confirmed').which.is.a.Boolean();
			done();
		});
	});

});
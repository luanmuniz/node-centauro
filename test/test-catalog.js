'use strict';

var libHelper = require('../lib/catalog/helper'),
	centauro = require('../index'),
	should = require('should'),
	mockLib = require('./mock/helper'),
	configFile = require('./config.js');

function checkFields(body, done) {
	body.should.be.a.Array();

	body[0].should.have.property('id').which.is.a.String();
	body[0].should.have.property('name').which.is.a.String();
	body[0].should.have.property('description').which.is.a.String();
	body[0].should.have.property('gender').which.is.a.String();
	body[0].should.have.property('manufacturer').which.is.a.String();
	body[0].should.have.property('images').which.is.a.Object();
	body[0].should.have.property('skus').which.is.a.Array();
	body[0].should.have.property('categories').which.is.a.Array();
	body[0].should.have.property('info').which.is.a.String();

	body[0].skus[0].should.have.property('id').which.is.a.String();
	body[0].skus[0].should.have.property('lastModification');
	body[0].skus[0].should.have.property('enable').which.is.a.Boolean();
	body[0].skus[0].should.have.property('model').which.is.a.String();
	body[0].skus[0].should.have.property('size').which.is.a.String();
	body[0].skus[0].should.have.property('balance').which.is.a.Number();
	body[0].skus[0].should.have.property('price').which.is.a.Number();

	body[0].images.should.have.property('small').which.is.a.String();
	body[0].images.should.have.property('medium').which.is.a.String();
	body[0].images.should.have.property('big').which.is.a.String();

	body[0].categories[0].should.have.property('id').which.is.a.String();
	body[0].categories[0].should.have.property('name').which.is.a.String();
	body[0].categories[0].should.have.property('group').which.is.a.String();
	body[0].categories[0].should.have.property('groupId').which.is.a.String();
	body[0].categories[0].should.have.property('subGroup').which.is.a.String();
	body[0].categories[0].should.have.property('subGroupId').which.is.a.String();

	done();
}

describe('Test Helper', function() {

	var xmlFull, xmlPartial, xmlCategoria, xmlEstoque;

	beforeEach(function(done) {
		libHelper = libHelper.init(configFile, 'development')
		libHelper.makeRequest = mockLib.makeRequest;
		done();
	});

	it('test parseProductObj for fullCatalog', function(done) {
		libHelper.makeRequest('full')
			.then(function(body) {
				return libHelper.parseProductObj(body);
			}).then(function(body) {
				body[0].skus[0].should.have.property('code').which.is.a.Number();
				body[0].skus[0].should.have.property('priceFrom').which.is.a.Number();

				checkFields(body, done);
			}).catch(console.log);
	});

	it('test parseProductObj for partialCatalog', function(done) {
		libHelper.makeRequest('partial')
			.then(function(body) {
				return libHelper.parseProductObj(body);
			}).then(function(body) {
				checkFields(body, done);
			});
	});

});

describe('Test Helper without catalog', function() {

	it('test parseProductObj for fullCatalog', function(done) {
		var configToEdit = Object.assign({}, configFile);

		delete configToEdit.partnerName;
		var libHelper = new centauro(configToEdit, 'development');
		libHelper.should.not.have.property('catalog');
		done();
	});

});

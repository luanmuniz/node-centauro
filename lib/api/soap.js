'use strict';

var Promise = (Promise || require('promise')),
	request = require('request-promise'),
	parser = require('xml2js').Parser({
		ignoreAttrs: true,
		explicitArray: false,
		tagNameProcessors: [function(tagName) {
			return tagName.replace(/(a|s)\:/, '');
		}],
		valueProcessors: [function(value) {
			if(Array.isArray(value) && value.length === 1) {
				return value[0];
			}

			if(value === 'false' || value === 'true') {
				return (value === 'true');
			}

			return value;
		}]
	}),
	helper = require('../helper'),
soapAPI = {

	soapURL: '',

	init: function(url) {
		soapAPI.soapURL = url;
		return soapAPI;
	},

	parseResponse: function(body) {
		var parserPromise = Promise.denodeify(parser.parseString);
		return parserPromise(body).then(function(result) {
			var result = result.Envelope.Body,
				keyName = Object.keys(result),
				subKeyName = Object.keys(result[keyName]);

			return Promise.resolve(result[keyName][subKeyName]);
		});
	},

	parseBody: function(method, params, schema) {
		var xml = '',
			byt = '';

		if(schema) {
			byt = 'xmlns:byt="http://schemas.datacontract.org/2004/07/ByTennis.B2B.Core.DTO.' + schema + '"';
		}

		xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" ' + byt + '>';
		xml += '<soapenv:Header/><soapenv:Body>';
		xml += '<tem:' + method + '>';

		Object.keys(params).forEach(function(key) {
			xml += '<tem:' + key + '>';
			xml += soapAPI.printSubTree(params[key]);
			xml += '</tem:' + key + '>';
		});

		xml += '</tem:' + method + '>';
		xml += '</soapenv:Body></soapenv:Envelope>';
		return xml;
	},

	printSubTree: function(value) {
		var xml = '';

		if(typeof value !== 'object') {
			return value;
		}

		Object.keys(value).forEach(function(subKeys) {
			if(!Array.isArray(value)) {
				xml += '<byt:' + subKeys + '>';
			}

			xml += soapAPI.printSubTree(value[subKeys]);

			if(!Array.isArray(value)) {
				xml += '</byt:' + subKeys + '>';
			}
		})

		return xml;
	},

	request: function(method, params, schema) {
		return request({
			method: 'POST',
			uri: soapAPI.soapURL.replace('?singleWsdl', ''),
			headers: {
				'SOAPAction': 'http://tempuri.org/IB2BFacade/' + method,
				'Content-Type': 'text/xml;charset=UTF-8'
			},
			transform: soapAPI.parseResponse,
			body: soapAPI.parseBody(method, params, schema)
		}).catch(function(err) {
			return helper.errorHandler('main', 0, err);
		});
	}

};

module.exports = Object.create(soapAPI);
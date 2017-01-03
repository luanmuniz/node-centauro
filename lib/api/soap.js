'use strict';

var Promise = require('promise'),
	got = require('got'),
	parser = require('xml2js').Parser({
		ignoreAttrs: true,
		explicitArray: false,
		tagNameProcessors: [ (tagName) => {
			return tagName.replace(/(a|s)\:/, '');
		} ],
		valueProcessors: [ (value) => {
			if(Array.isArray(value) && value.length === 1) {
				return value[0];
			}

			if(value === 'false' || value === 'true') {
				return (value === 'true');
			}

			return value;
		} ]
	}),
	helper = require('../helper'),
	soapAPI;

soapAPI = {

	soapURL: '',

	init(url) {
		soapAPI.soapURL = url;
		return soapAPI;
	},

	parseResponse(response) {
		var parserPromise = Promise.denodeify(parser.parseString);

		return parserPromise(response.body).then(function(responseBody) {
			var responseBody = responseBody.Envelope.Body,
				keyName = Object.keys(responseBody),
				subKeyName = Object.keys(responseBody[keyName]);

			return Promise.resolve(responseBody[keyName][subKeyName]);
		});
	},

	parseBody(method, params, schema) {
		var xml = '',
			byt = '';

		if(schema) {
			byt = `xmlns:byt="http://schemas.datacontract.org/2004/07/ByTennis.B2B.Core.DTO.${schema}"`;
		}

		xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" ${byt}>`;
		xml += '<soapenv:Header/><soapenv:Body>';
		xml += `<tem:${method}>`;

		Object.keys(params).forEach(function(key) {
			xml += `<tem:${key}>`;
			xml += soapAPI.printSubTree(params[key]);
			xml += `</tem:${key}>`;
		});

		xml += `</tem:${method}>`;
		xml += '</soapenv:Body></soapenv:Envelope>';
		return xml;
	},

	printSubTree(value) {
		var xml = '';

		if(typeof value !== 'object') {
			return value;
		}

		Object.keys(value).forEach(function(subKeys) {
			if(!Array.isArray(value)) {
				xml += `<byt:${subKeys}>`;
			}

			xml += soapAPI.printSubTree(value[subKeys]);

			if(!Array.isArray(value)) {
				xml += `</byt:${subKeys}>`;
			}
		});

		return xml;
	},

	request(method, params, schema) {
		return got(soapAPI.soapURL.replace('?singleWsdl', ''), {
			method: 'POST',
			headers: {
				'SOAPAction': `http://tempuri.org/IB2BFacade/${method}`,
				'Content-Type': 'text/xml;charset=UTF-8'
			},
			body: soapAPI.parseBody(method, params, schema)
		}).catch(function(requestError) {
			return helper.errorHandler('main', 0, requestError);
		}).then(soapAPI.parseResponse);
	}

};

module.exports = Object.create(soapAPI);

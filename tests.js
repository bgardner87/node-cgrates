var assert = require('assert');
var CGRates = require('./index');

var cgRates = null;

describe("CGRates", function() {
	beforeEach(function() {
		cgRates = new CGRates("http://test.com");
	});

	it("should require a url", function(){
		cgRates.needle = {};
		assert.throws(CGRates, Error, "CGRates allowed initialization without a URL");
	});

	describe("Accounts", function() {
		describe("GetAccounts", function() {
			it("should require tenant", function() {
				assert.throws(() => {cgRates.getAccounts()}, Error, "Didn't throw exception when tenant is missing.");
			});

			it("should reject if the http request fails", function(done) {
				cgRates.needle.post = function(url, data, options, callback) {
					callback(new Error('test'));
				};

				var promise = cgRates.getAccounts({Tenant:'test'});

				promise.then(function(result) {
					done(new Error("Promise resolved on failed http request."));
				}, function(err) {
					done();
				})
			});

			it("should reject if the http status code is not 200", function(done) {
				cgRates.needle.post = function(url, data, options, callback) {
					callback(null, {statusCode: 500});
				};

				var promise = cgRates.getAccounts({Tenant:'test'});

				promise.then(function(result) {
					done(new Error("Promise resolved on failed http request."));
				}, function(err) {
					done();
				})
			});

			it("should reject if the http response body has an error from CG Rates", function(done) {
				cgRates.needle.post = function(url, data, options, callback) {
					callback(null, {statusCode: 200, body:{error:"error"}});
				};

				var promise = cgRates.getAccounts({Tenant:'test'});

				promise.then(function(result) {
					done(new Error("Promise resolved on failed http request."));
				}, function(err) {
					done();
				})
			});

			it("should resolve with the request body result", function(done) {
				cgRates.needle.post = function(url, data, options, callback) {
					callback(null, {statusCode: 200, body:{result:[{id:1},{id:2}]}});
				};

				var promise = cgRates.getAccounts({Tenant:'test'});

				promise.then(function(result) {
					done();
				}, function(err) {
					done(new Error("Promise rejected on valid request and response."));
				})
			});
		});
	});
})

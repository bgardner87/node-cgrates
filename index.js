var needle = require('needle');


var CGRates = function(url) {
	var self = this;
	if (!url) {
		throw new Error("URL is required");
	}

	this.url = url;
	this.needle = needle;



	//{"id": 3, "method": "ApierV2.GetAccounts", "params": [{"Tenant": "domain.com"}]}
	this.getAccounts = function(options, request_id) {
		if (!options.Tenant) {
			throw new Error("Tenant is required");
		}

		var data = {
			method: "ApierV2.GetAccounts",
			params: [options]
		};

		if (request_id) {
			data.id = request_id;
		}

		var promise = new Promise(function(resolve, reject) {
			self.needle.post(self.url, data, {json:true}, function(err, response) {
				if (err) {
					return reject(err);
				}

				if (response.statusCode != 200) {
					return reject(new Error(response.body));
				}

				if (response.body.error) {
					return reject(new Error(response.body.error));
				}

				resolve(response.body.result);
			});
		});
		
		return promise;
	};

	

	return this;
}

module.exports = CGRates;

// var cgRates = new CGRates("http://172.20.4.13:2080/jsonrpc");

// var data = {Tenant: "reper.io"};

// cgRates.getAccounts(data).then(function(result) {
// 	console.log(result);
// }, function(err) {
// 	console.log("ERROR");
// 	console.log(err);
// });


// needle.get('http://www.google.com', function(error, response) {
//   if (!error && response.statusCode == 200)
//     console.log(response.body);
// });
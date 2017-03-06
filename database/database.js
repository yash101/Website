var mysql = require('mysql');
var async = require('async');

var constants = require('../constants.js');

var state = {
	pool: null
};

exports.connect = function connectDB(done) {
	if(!state.pool) {
		state.pool = mysql.createPool({
			host: constants.db.host,
			user: constants.db.user,
			password: constants.db.password,
			database: constants.db.name
		});
	}

	var sql = "CREATE TABLE IF NOT EXISTS `configuration` ("
	+ "`key` VARCHAR(64) NOT NULL,"
	+ "`value` VARCHAR(256) NOT NULL,"
	+ "UNIQUE `key` (`key`)"
	+ ")";

	exports.get().getConnection(function(err, connection) {
		if(err) {
			console.log(err);
		}

		connection.query(sql, function(err, results) {
			connection.release();
			if(err) {
				console.log(err);
			}
			console.log("Created table successfully!");
		});
	});

	done();
};

exports.get = function() {
	return state.pool;
};

exports.getConfigValue = function(key, cb) {
	exports.connect(function() {
	var sql = "SELECT value FROM configuration WHERE key = ?";
		exports.get().getConnection(function(err, connection) {
			if(err) {
				console.log(err);
			}

			connection.query(sql, [key], function(err, results) {
				connection.release();
				if(err) {
					console.log(err);
					cb(true, results);
				} else {
					cb(false, results);
				}
			});
		});
	});
};
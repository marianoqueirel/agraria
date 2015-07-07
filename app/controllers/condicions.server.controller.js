'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Condicion = mongoose.model('Condicion'),
	_ = require('lodash');

/**
 * Create a Condicion
 */
exports.create = function(req, res) {
	var condicion = new Condicion(req.body);
	condicion.user = req.user;

	condicion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(condicion);
		}
	});
};

/**
 * Show the current Condicion
 */
exports.read = function(req, res) {
	res.jsonp(req.condicion);
};

/**
 * Update a Condicion
 */
exports.update = function(req, res) {
	var condicion = req.condicion ;

	condicion = _.extend(condicion , req.body);

	condicion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(condicion);
		}
	});
};

/**
 * Delete an Condicion
 */
exports.delete = function(req, res) {
	var condicion = req.condicion ;

	condicion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(condicion);
		}
	});
};

/**
 * List of Condicions
 */
exports.list = function(req, res) { 
	Condicion.find().sort('-created').populate('user', 'displayName').exec(function(err, condicions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(condicions);
		}
	});
};

/**
 * Condicion middleware
 */
exports.condicionByID = function(req, res, next, id) { 
	Condicion.findById(id).populate('user', 'displayName').exec(function(err, condicion) {
		if (err) return next(err);
		if (! condicion) return next(new Error('Failed to load Condicion ' + id));
		req.condicion = condicion ;
		next();
	});
};

/**
 * Condicion authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.condicion.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

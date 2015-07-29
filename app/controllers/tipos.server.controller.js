'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tipo = mongoose.model('Tipo'),
	_ = require('lodash');

/**
 * Create a Tipo
 */
exports.create = function(req, res) {
	var tipo = new Tipo(req.body);
	tipo.user = req.user;

	tipo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipo);
		}
	});
};

/**
 * Show the current Tipo
 */
exports.read = function(req, res) {
	res.jsonp(req.tipo);
};

/**
 * Update a Tipo
 */
exports.update = function(req, res) {
	var tipo = req.tipo ;

	tipo = _.extend(tipo , req.body);

	tipo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipo);
		}
	});
};

/**
 * Delete an Tipo
 */
exports.delete = function(req, res) {
	var tipo = req.tipo ;

	tipo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipo);
		}
	});
};

/**
 * List of Tipos
 */
exports.list = function(req, res) { 
	Tipo.find().sort('-created').populate('user', 'displayName').exec(function(err, tipos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tipos);
		}
	});
};

/**
 * Tipo middleware
 */
exports.tipoByID = function(req, res, next, id) { 
	Tipo.findById(id).populate('user', 'displayName').exec(function(err, tipo) {
		if (err) return next(err);
		if (! tipo) return next(new Error('Failed to load Tipo ' + id));
		req.tipo = tipo ;
		next();
	});
};

/**
 * Tipo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tipo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

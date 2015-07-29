'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Programa = mongoose.model('Programa'),
	_ = require('lodash');

/**
 * Create a Programa
 */
exports.create = function(req, res) {
	var programa = new Programa(req.body);
	programa.user = req.user;

	programa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programa);
		}
	});
};

/**
 * Show the current Programa
 */
exports.read = function(req, res) {
	res.jsonp(req.programa);
};

/**
 * Update a Programa
 */
exports.update = function(req, res) {
	var programa = req.programa ;

	programa = _.extend(programa , req.body);

	programa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programa);
		}
	});
};

/**
 * Delete an Programa
 */
exports.delete = function(req, res) {
	var programa = req.programa ;

	programa.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programa);
		}
	});
};

/**
 * List of Programas
 */
exports.list = function(req, res) { 
	Programa.find().sort('-created').populate('user', 'displayName').exec(function(err, programas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programas);
		}
	});
};

/**
 * Programa middleware
 */
exports.programaByID = function(req, res, next, id) { 
	Programa.findById(id).populate('user', 'displayName').exec(function(err, programa) {
		if (err) return next(err);
		if (! programa) return next(new Error('Failed to load Programa ' + id));
		req.programa = programa ;
		next();
	});
};

/**
 * Programa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.programa.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

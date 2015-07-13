'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Universidad = mongoose.model('Universidad'),
	_ = require('lodash');

/**
 * Create a Universidad
 */
exports.create = function(req, res) {
	var universidad = new Universidad(req.body);
	universidad.user = req.user;

	universidad.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(universidad);
		}
	});
};

/**
 * Show the current Universidad
 */
exports.read = function(req, res) {
	res.jsonp(req.universidad);
};

/**
 * Update a Universidad
 */
exports.update = function(req, res) {
	var universidad = req.universidad ;

	universidad = _.extend(universidad , req.body);

	universidad.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(universidad);
		}
	});
};

/**
 * Delete an Universidad
 */
exports.delete = function(req, res) {
	var universidad = req.universidad ;

	universidad.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(universidad);
		}
	});
};

/**
 * List of Universidads
 */
exports.list = function(req, res) { 
	Universidad.find().sort('-created').populate('user', 'displayName').exec(function(err, universidads) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(universidads);
		}
	});
};

/**
 * Universidad middleware
 */
exports.universidadByID = function(req, res, next, id) { 
	Universidad.findById(id).populate('user', 'displayName').exec(function(err, universidad) {
		if (err) return next(err);
		if (! universidad) return next(new Error('Failed to load Universidad ' + id));
		req.universidad = universidad ;
		next();
	});
};

/**
 * Universidad authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.universidad.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

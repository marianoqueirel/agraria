'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Condicion Schema
 */
var CondicionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Condicion name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Condicion', CondicionSchema);
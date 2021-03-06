'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Universidad Schema
 */
var UniversidadSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Universidad name',
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

mongoose.model('Universidad', UniversidadSchema);
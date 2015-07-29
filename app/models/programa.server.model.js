'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Programa Schema
 */
var ProgramaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Programa name',
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

mongoose.model('Programa', ProgramaSchema);
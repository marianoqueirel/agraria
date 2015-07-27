'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Persona Schema
 */
var PersonaSchema = new Schema({
	nombre: {
		type: String,		
		required: 'Ingresar Nombre de la Persona',
		trim: true
	},
	apellido: {
		type: String,		
		required: 'Ingresar Apellido de la Persona',
		trim: true
	},
	dni: {
		type: String,		
		required: 'Ingresar el DNI de la Persona',
		trim: true
	},
	telefono: {
		type: String,		
		required: 'Ingresar el Teléfono de la Persona',
		trim: true
	},
	email: {
    type: String,
    required: 'Ingresar el Email de la Persona',  
    trim: true
  },
  periodo: {
    desde: {type: String,	required: 'Ingrese Fecha del Perdiodo - Desde'},
    hasta: {type: String, required: 'Ingrese Fecha del Perdiodo - Hasta'}
  },
  anio_movilidad:{
  	type: String, 
  	trim: true
  },
  universidad:{
  	origen: {type: Schema.ObjectId, ref: 'Universidad'},
  	destino: {type: Schema.ObjectId,ref: 'Universidad'}
  },
  tutor:{
  	nombre:{type: String, trim: true},
  	email: {type: String, trim: true}
  },
  condicion: {
  	type: Schema.ObjectId,
  	ref: 'Condicion'
  },
  programa: {
  	type: Schema.ObjectId,
  	ref: 'Programa'
  },
  tipo: {
  	type: Schema.ObjectId,
  	ref: 'Tipo'
  },
  observaciones: {
  	type: String,
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

mongoose.model('Persona', PersonaSchema);
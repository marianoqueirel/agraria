'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tipos = require('../../app/controllers/tipos.server.controller');

	// Tipos Routes
	app.route('/tipos')
		.get(tipos.list)
		.post(users.requiresLogin, tipos.create);

	app.route('/tipos/:tipoId')
		.get(tipos.read)
		.put(users.requiresLogin, tipos.hasAuthorization, tipos.update)
		.delete(users.requiresLogin, tipos.hasAuthorization, tipos.delete);

	// Finish by binding the Tipo middleware
	app.param('tipoId', tipos.tipoByID);
};

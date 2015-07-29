'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var programas = require('../../app/controllers/programas.server.controller');

	// Programas Routes
	app.route('/programas')
		.get(programas.list)
		.post(users.requiresLogin, programas.create);

	app.route('/programas/:programaId')
		.get(programas.read)
		.put(users.requiresLogin, programas.hasAuthorization, programas.update)
		.delete(users.requiresLogin, programas.hasAuthorization, programas.delete);

	// Finish by binding the Programa middleware
	app.param('programaId', programas.programaByID);
};

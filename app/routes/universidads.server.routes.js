'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var universidads = require('../../app/controllers/universidads.server.controller');

	// Universidads Routes
	app.route('/universidads')
		.get(universidads.list)
		.post(users.requiresLogin, universidads.create);

	app.route('/universidads/:universidadId')
		.get(universidads.read)
		.put(users.requiresLogin, universidads.hasAuthorization, universidads.update)
		.delete(users.requiresLogin, universidads.hasAuthorization, universidads.delete);

	// Finish by binding the Universidad middleware
	app.param('universidadId', universidads.universidadByID);
};

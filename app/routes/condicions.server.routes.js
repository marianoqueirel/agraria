'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var condicions = require('../../app/controllers/condicions.server.controller');

	// Condicions Routes
	app.route('/condicions')
		.get(condicions.list)
		.post(users.requiresLogin, condicions.create);

	app.route('/condicions/:condicionId')
		.get(condicions.read)
		.put(users.requiresLogin, condicions.hasAuthorization, condicions.update)
		.delete(users.requiresLogin, condicions.hasAuthorization, condicions.delete);

	// Finish by binding the Condicion middleware
	app.param('condicionId', condicions.condicionByID);
};

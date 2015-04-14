'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var diapers = require('../../app/controllers/diapers.server.controller');

	// diapers Routes
	app.route('/diapers')
		.get(diapers.list)
		.post(users.requiresLogin, diapers.create);

	app.route('/diapers/:diaperId')
		.get(diapers.read)
		.put(users.requiresLogin, diapers.hasAuthorization, diapers.update)
		.delete(users.requiresLogin, diapers.hasAuthorization, diapers.delete);

	// Finish by binding the diapers middleware
	app.param('diaperId', diapers.diaperByID);
};
'use strict';

//Setting up route
angular.module('universidads').config(['$stateProvider',
	function($stateProvider) {
		// Universidads state routing
		$stateProvider.
		state('listUniversidads', {
			url: '/universidads',
			templateUrl: 'modules/universidads/views/list-universidads.client.view.html'
		}).
		state('createUniversidad', {
			url: '/universidads/create',
			templateUrl: 'modules/universidads/views/create-universidad.client.view.html'
		}).
		state('viewUniversidad', {
			url: '/universidads/:universidadId',
			templateUrl: 'modules/universidads/views/view-universidad.client.view.html'
		}).
		state('editUniversidad', {
			url: '/universidads/:universidadId/edit',
			templateUrl: 'modules/universidads/views/edit-universidad.client.view.html'
		});
	}
]);
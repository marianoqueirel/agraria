'use strict';

//Setting up route
angular.module('condicions').config(['$stateProvider',
	function($stateProvider) {
		// Condicions state routing
		$stateProvider.
		state('listCondicions', {
			url: '/condicions',
			templateUrl: 'modules/condicions/views/list-condicions.client.view.html'
		}).
		state('createCondicion', {
			url: '/condicions/create',
			templateUrl: 'modules/condicions/views/create-condicion.client.view.html'
		}).
		state('viewCondicion', {
			url: '/condicions/:condicionId',
			templateUrl: 'modules/condicions/views/view-condicion.client.view.html'
		}).
		state('editCondicion', {
			url: '/condicions/:condicionId/edit',
			templateUrl: 'modules/condicions/views/edit-condicion.client.view.html'
		});
	}
]);
'use strict';

//Setting up route
angular.module('tipos').config(['$stateProvider',
	function($stateProvider) {
		// Tipos state routing
		$stateProvider.
		state('listTipos', {
			url: '/tipos',
			templateUrl: 'modules/tipos/views/list-tipos.client.view.html'
		}).
		state('createTipo', {
			url: '/tipos/create',
			templateUrl: 'modules/tipos/views/create-tipo.client.view.html'
		}).
		state('viewTipo', {
			url: '/tipos/:tipoId',
			templateUrl: 'modules/tipos/views/view-tipo.client.view.html'
		}).
		state('editTipo', {
			url: '/tipos/:tipoId/edit',
			templateUrl: 'modules/tipos/views/edit-tipo.client.view.html'
		});
	}
]);
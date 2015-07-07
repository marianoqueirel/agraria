'use strict';

//Tipos service used to communicate Tipos REST endpoints
angular.module('tipos').factory('Tipos', ['$resource',
	function($resource) {
		return $resource('tipos/:tipoId', { tipoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
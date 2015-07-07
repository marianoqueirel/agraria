'use strict';

//Programas service used to communicate Programas REST endpoints
angular.module('programas').factory('Programas', ['$resource',
	function($resource) {
		return $resource('programas/:programaId', { programaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
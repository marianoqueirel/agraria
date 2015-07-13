'use strict';

//Universidads service used to communicate Universidads REST endpoints
angular.module('universidads').factory('Universidads', ['$resource',
	function($resource) {
		return $resource('universidads/:universidadId', { universidadId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
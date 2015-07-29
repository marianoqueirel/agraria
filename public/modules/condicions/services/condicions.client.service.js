'use strict';

//Condicions service used to communicate Condicions REST endpoints
angular.module('condicions').factory('Condicions', ['$resource',
	function($resource) {
		return $resource('condicions/:condicionId', { condicionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
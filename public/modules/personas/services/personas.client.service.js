'use strict';

//Personas service used to communicate Personas REST endpoints
angular.module('personas').factory('Personas', ['$resource', '$http',
	function($resource, $http) {
		return{
      personas: $resource('personas/:personaId', { personaId: '@_id'}, {update: {method: 'PUT'}}),
      programas: function(){ 
        return $http({method: 'GET', url: '/programas'}); 
      },
      tipos: function(){ 
        return $http({method: 'GET', url: '/tipos'}); 
      },
      condicions: function(){ 
        return $http({method: 'GET', url: '/condicions'}); 
      }
    }; 
  }]
);
'use strict';

//Personas service used to communicate Personas REST endpoints
angular.module('personas').factory('Personas', ['$resource', '$http',
	function($resource, $http) {
		return{
      personas: $resource('personas/:personaId', { personaId: '@_id'}, {update: {method: 'PUT'}}),
      programas: $resource('programas/:programaId', { programaId: '@_id'}, {update: {  method: 'PUT'}}),
      tipos: $resource('tipos/:tipoId', { tipoId: '@_id'}, {update: {method: 'PUT'}}),
      universidades: $resource('universidads/:universidadId', { universidadId: '@_id'}, {update: {method: 'PUT'}}),      
      condiciones: $resource('condicions/:condicionId', { condicionId: '@_id'}, {update: {method: 'PUT'}})
    }; 
  }]
);
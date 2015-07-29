'use strict';

// Personas controller
angular.module('personas').controller('PersonasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Personas',
	function($scope, $stateParams, $location, Authentication, Personas) {
		$scope.authentication = Authentication;

		// Create new Persona
		$scope.create = function() {
			// Create new Persona object
			var persona = new Personas.personas ({
				nombre: this.nombre,
				apellido: this.apellido,
				dni: this.dni,
				telefono: this.telefono,
				email: this.email,
				periodo: this.periodo,
				anio_movilidad: this.anio_movilidad,
				universidad: this.universidad,
				tutor: this.tutor,
				condicion: this.condicion,
				programa: this.programa,
				tipo: this.tipo,
				observaciones: this.observaciones
			});

			// Redirect after save
			persona.$save(function(response) {
				$location.path('personas/' + response._id);

				// Clear form fields
				$scope.nombre = '';
				$scope.apellido = '';
				$scope.dni = '';
				$scope.telefono = '';
				$scope.email = '';
				$scope.periodo = '';
				$scope.anio_movilidad = '';
				$scope.universidad = '';
				$scope.tutor = '';
				$scope.condicion = '';
				$scope.programa = '';
				$scope.tipo = '';
				$scope.observaciones = '';				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Persona
		$scope.remove = function(persona) {
			if ( persona ) { 
				persona.$remove();

				for (var i in $scope.personas) {
					if ($scope.personas [i] === persona) {
						$scope.personas.splice(i, 1);
					}
				}
			} else {
				$scope.persona.$remove(function() {
					$location.path('personas');
				});
			}
		};

		// Update existing Persona
		$scope.update = function() {
			var persona = $scope.persona;

			persona.$update(function() {
				$location.path('personas/' + persona._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Personas
		$scope.find = function() {
			$scope.personas = Personas.personas.query();
			$scope.programas = Personas.programas.query();
			$scope.tipos = Personas.tipos.query();
			$scope.universidades = Personas.universidades.query();
			$scope.condiciones = Personas.condiciones.query();
		};

		// Find existing Persona
		$scope.findOne = function() {
			$scope.persona = Personas.personas.get({ 
				personaId: $stateParams.personaId
			});
		};
	}
]);
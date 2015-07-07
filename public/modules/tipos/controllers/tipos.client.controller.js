'use strict';

// Tipos controller
angular.module('tipos').controller('TiposController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tipos',
	function($scope, $stateParams, $location, Authentication, Tipos) {
		$scope.authentication = Authentication;

		// Create new Tipo
		$scope.create = function() {
			// Create new Tipo object
			var tipo = new Tipos ({
				name: this.name
			});

			// Redirect after save
			tipo.$save(function(response) {
				$location.path('tipos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tipo
		$scope.remove = function(tipo) {
			if ( tipo ) { 
				tipo.$remove();

				for (var i in $scope.tipos) {
					if ($scope.tipos [i] === tipo) {
						$scope.tipos.splice(i, 1);
					}
				}
			} else {
				$scope.tipo.$remove(function() {
					$location.path('tipos');
				});
			}
		};

		// Update existing Tipo
		$scope.update = function() {
			var tipo = $scope.tipo;

			tipo.$update(function() {
				$location.path('tipos/' + tipo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tipos
		$scope.find = function() {
			$scope.tipos = Tipos.query();
		};

		// Find existing Tipo
		$scope.findOne = function() {
			$scope.tipo = Tipos.get({ 
				tipoId: $stateParams.tipoId
			});
		};
	}
]);
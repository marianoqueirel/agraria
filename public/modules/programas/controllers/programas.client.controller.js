'use strict';

// Programas controller
angular.module('programas').controller('ProgramasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Programas',
	function($scope, $stateParams, $location, Authentication, Programas) {
		$scope.authentication = Authentication;

		// Create new Programa
		$scope.create = function() {
			// Create new Programa object
			var programa = new Programas ({
				name: this.name
			});

			// Redirect after save
			programa.$save(function(response) {
				$location.path('programas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Programa
		$scope.remove = function(programa) {
			if ( programa ) { 
				programa.$remove();

				for (var i in $scope.programas) {
					if ($scope.programas [i] === programa) {
						$scope.programas.splice(i, 1);
					}
				}
			} else {
				$scope.programa.$remove(function() {
					$location.path('programas');
				});
			}
		};

		// Update existing Programa
		$scope.update = function() {
			var programa = $scope.programa;

			programa.$update(function() {
				$location.path('programas/' + programa._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Programas
		$scope.find = function() {
			$scope.programas = Programas.query();
		};

		// Find existing Programa
		$scope.findOne = function() {
			$scope.programa = Programas.get({ 
				programaId: $stateParams.programaId
			});
		};
	}
]);
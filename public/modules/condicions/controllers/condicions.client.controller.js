'use strict';

// Condicions controller
angular.module('condicions').controller('CondicionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Condicions',
	function($scope, $stateParams, $location, Authentication, Condicions) {
		$scope.authentication = Authentication;

		// Create new Condicion
		$scope.create = function() {
			// Create new Condicion object
			var condicion = new Condicions ({
				name: this.name
			});

			// Redirect after save
			condicion.$save(function(response) {
				$location.path('condicions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Condicion
		$scope.remove = function(condicion) {
			if ( condicion ) { 
				condicion.$remove();

				for (var i in $scope.condicions) {
					if ($scope.condicions [i] === condicion) {
						$scope.condicions.splice(i, 1);
					}
				}
			} else {
				$scope.condicion.$remove(function() {
					$location.path('condicions');
				});
			}
		};

		// Update existing Condicion
		$scope.update = function() {
			var condicion = $scope.condicion;

			condicion.$update(function() {
				$location.path('condicions/' + condicion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Condicions
		$scope.find = function() {
			$scope.condicions = Condicions.query();
		};

		// Find existing Condicion
		$scope.findOne = function() {
			$scope.condicion = Condicions.get({ 
				condicionId: $stateParams.condicionId
			});
		};
	}
]);
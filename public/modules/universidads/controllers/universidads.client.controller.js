'use strict';

// Universidads controller
angular.module('universidads').controller('UniversidadsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Universidads',
	function($scope, $stateParams, $location, Authentication, Universidads) {
		$scope.authentication = Authentication;

		// Create new Universidad
		$scope.create = function() {
			// Create new Universidad object
			var universidad = new Universidads ({
				name: this.name
			});

			// Redirect after save
			universidad.$save(function(response) {
				$location.path('universidads/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Universidad
		$scope.remove = function(universidad) {
			if ( universidad ) { 
				universidad.$remove();

				for (var i in $scope.universidads) {
					if ($scope.universidads [i] === universidad) {
						$scope.universidads.splice(i, 1);
					}
				}
			} else {
				$scope.universidad.$remove(function() {
					$location.path('universidads');
				});
			}
		};

		// Update existing Universidad
		$scope.update = function() {
			var universidad = $scope.universidad;

			universidad.$update(function() {
				$location.path('universidads/' + universidad._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Universidads
		$scope.find = function() {
			$scope.universidads = Universidads.query();
		};

		// Find existing Universidad
		$scope.findOne = function() {
			$scope.universidad = Universidads.get({ 
				universidadId: $stateParams.universidadId
			});
		};
	}
]);
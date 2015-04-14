'use strict';

// Diaper controller
angular.module('diapers').controller('DiaperController', ['$scope', '$stateParams', '$location', 'Authentication', 'Diaper',
	function($scope, $stateParams, $location, Authentication, Diapers) {
		$scope.authentication = Authentication;

		// Create new Diaper
		$scope.create = function() {
			// Create new Diaper object
			var diaper = new Diaper ({
				name: this.name,
				timeFeed: this.timeFeed,
				bottle: this.bottle,
				breast: this.breast,
				amount: this.amount,
				comment: this.comment
			});

			// Redirect after save
			diaper.$save(function(response) {
				$location.path('diapers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Diaper
		$scope.remove = function(diaper) {
			if ( diaper ) { 
				diaper.$remove();

				for (var i in $scope.diapers) {
					if ($scope.diapers [i] === diaper) {
						$scope.diapers.splice(i, 1);
					}
				}
			} else {
				$scope.diaper.$remove(function() {
					$location.path('diapers');
				});
			}
		};

		// Update existing Diaper
		$scope.update = function() {
			var diaper = $scope.diaper;

			diaper.$update(function() {
				$location.path('diapers/' + diaper._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Diapers
		$scope.find = function() {
			$scope.diaper = Diaper.query();
		};

		// Find existing Diaper
		$scope.findOne = function() {
			$scope.diapers = Diaper.get({ 
				diaperId: $stateParams.diaperId
			});
		};
	}
]);
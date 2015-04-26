'use strict';

// Setting up route
angular.module('tracking').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('tracking', {
			url: '/',
			templateUrl: 'modules/tracking/views/tracking.client.view.html'
		});
	}
]);
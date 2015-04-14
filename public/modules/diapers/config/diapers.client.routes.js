'use strict';

//Setting up route
angular.module('diapers').config(['$stateProvider',
	function($stateProvider) {
		// Diapers state routing
		$stateProvider.
		state('listDiapers', {
			url: '/diapers',
			templateUrl: 'modules/diapers/views/list-diapers.client.view.html'
		}).
		state('createDiaper', {
			url: '/diapers/create',
			templateUrl: 'modules/diapers/views/create-diaper.client.view.html'
		}).
		state('viewDiaper', {
			url: '/diapers/:diaperId',
			templateUrl: 'modules/diapers/views/view-diaper.client.view.html'
		}).
		state('editDiaper', {
			url: '/diapers/:diaperId/edit',
			templateUrl: 'modules/diapers/views/edit-diaper.client.view.html'
		});
	}
]);
'use strict';

//Diapers service used to communicate Diapers REST endpoints
angular.module('diapers').factory('Diapers', ['$resource',
	function($resource) {
		return $resource('diapers/:diaperId', { diaperId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('diapers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Diapers', 'diapers', 'dropdown', '/diapers(/create)?');
		Menus.addSubMenuItem('topbar', 'diapers', 'List Diapers', 'diapers');
		Menus.addSubMenuItem('topbar', 'diapers', 'New Diaper', 'diapers/create');
	}
]);
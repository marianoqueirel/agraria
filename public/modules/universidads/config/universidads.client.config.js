'use strict';

// Configuring the Articles module
angular.module('universidads').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Universidades', 'universidads', 'dropdown', '/universidads(/create)?');
		Menus.addSubMenuItem('topbar', 'universidads', 'List Universidads', 'universidads');
		Menus.addSubMenuItem('topbar', 'universidads', 'New Universidad', 'universidads/create');
	}
]);
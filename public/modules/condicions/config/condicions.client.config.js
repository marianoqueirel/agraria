'use strict';

// Configuring the Articles module
angular.module('condicions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Condiciones', 'condicions', 'dropdown', '/condicions(/create)?');
		Menus.addSubMenuItem('topbar', 'condicions', 'Listar Condiciones', 'condicions');
		Menus.addSubMenuItem('topbar', 'condicions', 'Crear Condición', 'condicions/create');
	}
]);
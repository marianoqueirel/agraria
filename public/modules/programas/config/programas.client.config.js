'use strict';

// Configuring the Articles module
angular.module('programas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Programas', 'programas', 'dropdown', '/programas(/create)?');
		Menus.addSubMenuItem('topbar', 'programas', 'Listar Programas', 'programas');
		Menus.addSubMenuItem('topbar', 'programas', 'Crear Programa', 'programas/create');
	}
]);
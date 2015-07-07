'use strict';

// Configuring the Articles module
angular.module('personas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Personas', 'personas', 'dropdown', '/personas(/create)?');
		Menus.addSubMenuItem('topbar', 'personas', 'Listar Personas', 'personas');
		Menus.addSubMenuItem('topbar', 'personas', 'Crear Persona', 'personas/create');
	}
]);
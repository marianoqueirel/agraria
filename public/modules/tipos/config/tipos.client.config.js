'use strict';

// Configuring the Articles module
angular.module('tipos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tipos', 'tipos', 'dropdown', '/tipos(/create)?');
		Menus.addSubMenuItem('topbar', 'tipos', 'Listar Tipos', 'tipos');
		Menus.addSubMenuItem('topbar', 'tipos', 'Crear Tipo', 'tipos/create');
	}
]);
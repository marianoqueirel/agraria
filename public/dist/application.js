'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'agrarias';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('condicions');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('personas');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('programas');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('tipos');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('universidads');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
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
'use strict';

//Setting up route
angular.module('condicions').config(['$stateProvider',
	function($stateProvider) {
		// Condicions state routing
		$stateProvider.
		state('listCondicions', {
			url: '/condicions',
			templateUrl: 'modules/condicions/views/list-condicions.client.view.html'
		}).
		state('createCondicion', {
			url: '/condicions/create',
			templateUrl: 'modules/condicions/views/create-condicion.client.view.html'
		}).
		state('viewCondicion', {
			url: '/condicions/:condicionId',
			templateUrl: 'modules/condicions/views/view-condicion.client.view.html'
		}).
		state('editCondicion', {
			url: '/condicions/:condicionId/edit',
			templateUrl: 'modules/condicions/views/edit-condicion.client.view.html'
		});
	}
]);
'use strict';

// Condicions controller
angular.module('condicions').controller('CondicionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Condicions',
	function($scope, $stateParams, $location, Authentication, Condicions) {
		$scope.authentication = Authentication;

		// Create new Condicion
		$scope.create = function() {
			// Create new Condicion object
			var condicion = new Condicions ({
				name: this.name
			});

			// Redirect after save
			condicion.$save(function(response) {
				$location.path('condicions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Condicion
		$scope.remove = function(condicion) {
			if ( condicion ) { 
				condicion.$remove();

				for (var i in $scope.condicions) {
					if ($scope.condicions [i] === condicion) {
						$scope.condicions.splice(i, 1);
					}
				}
			} else {
				$scope.condicion.$remove(function() {
					$location.path('condicions');
				});
			}
		};

		// Update existing Condicion
		$scope.update = function() {
			var condicion = $scope.condicion;

			condicion.$update(function() {
				$location.path('condicions/' + condicion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Condicions
		$scope.find = function() {
			$scope.condicions = Condicions.query();
		};

		// Find existing Condicion
		$scope.findOne = function() {
			$scope.condicion = Condicions.get({ 
				condicionId: $stateParams.condicionId
			});
		};
	}
]);
'use strict';

//Condicions service used to communicate Condicions REST endpoints
angular.module('condicions').factory('Condicions', ['$resource',
	function($resource) {
		return $resource('condicions/:condicionId', { condicionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

//Setting up route
angular.module('personas').config(['$stateProvider',
	function($stateProvider) {
		// Personas state routing
		$stateProvider.
		state('listPersonas', {
			url: '/personas',
			templateUrl: 'modules/personas/views/list-personas.client.view.html'
		}).
		state('createPersona', {
			url: '/personas/create',
			templateUrl: 'modules/personas/views/create-persona.client.view.html'
		}).
		state('viewPersona', {
			url: '/personas/:personaId',
			templateUrl: 'modules/personas/views/view-persona.client.view.html'
		}).
		state('editPersona', {
			url: '/personas/:personaId/edit',
			templateUrl: 'modules/personas/views/edit-persona.client.view.html'
		});
	}
]);
'use strict';

// Personas controller
angular.module('personas').controller('PersonasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Personas',
	function($scope, $stateParams, $location, Authentication, Personas) {
		$scope.authentication = Authentication;

		// Create new Persona
		$scope.create = function() {
			// Create new Persona object
			var persona = new Personas.personas ({
				nombre: this.nombre,
				apellido: this.apellido,
				dni: this.dni,
				telefono: this.telefono,
				email: this.email,
				periodo: this.periodo,
				anio_movilidad: this.anio_movilidad,
				universidad: this.universidad,
				tutor: this.tutor,
				condicion: this.condicion,
				programa: this.programa,
				tipo: this.tipo,
				observaciones: this.observaciones
			});

			// Redirect after save
			persona.$save(function(response) {
				$location.path('personas/' + response._id);

				// Clear form fields
				$scope.nombre = '';
				$scope.apellido = '';
				$scope.dni = '';
				$scope.telefono = '';
				$scope.email = '';
				$scope.periodo = '';
				$scope.anio_movilidad = '';
				$scope.universidad = '';
				$scope.tutor = '';
				$scope.condicion = '';
				$scope.programa = '';
				$scope.tipo = '';
				$scope.observaciones = '';				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Persona
		$scope.remove = function(persona) {
			if ( persona ) { 
				persona.$remove();

				for (var i in $scope.personas) {
					if ($scope.personas [i] === persona) {
						$scope.personas.splice(i, 1);
					}
				}
			} else {
				$scope.persona.$remove(function() {
					$location.path('personas');
				});
			}
		};

		// Update existing Persona
		$scope.update = function() {
			var persona = $scope.persona;

			persona.$update(function() {
				$location.path('personas/' + persona._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Personas
		$scope.find = function() {
			$scope.personas = Personas.personas.query();
			$scope.programas = Personas.programas.query();
			$scope.tipos = Personas.tipos.query();
			$scope.universidades = Personas.universidades.query();
			$scope.condiciones = Personas.condiciones.query();
		};

		// Find existing Persona
		$scope.findOne = function() {
			$scope.persona = Personas.personas.get({ 
				personaId: $stateParams.personaId
			});
		};
	}
]);
'use strict';

//Personas service used to communicate Personas REST endpoints
angular.module('personas').factory('Personas', ['$resource', '$http',
	function($resource, $http) {
		return{
      personas: $resource('personas/:personaId', { personaId: '@_id'}, {update: {method: 'PUT'}}),
      programas: $resource('programas/:programaId', { programaId: '@_id'}, {update: {  method: 'PUT'}}),
      tipos: $resource('tipos/:tipoId', { tipoId: '@_id'}, {update: {method: 'PUT'}}),
      universidades: $resource('universidads/:universidadId', { universidadId: '@_id'}, {update: {method: 'PUT'}}),      
      condiciones: $resource('condicions/:condicionId', { condicionId: '@_id'}, {update: {method: 'PUT'}})
    }; 
  }]
);
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
'use strict';

//Setting up route
angular.module('programas').config(['$stateProvider',
	function($stateProvider) {
		// Programas state routing
		$stateProvider.
		state('listProgramas', {
			url: '/programas',
			templateUrl: 'modules/programas/views/list-programas.client.view.html'
		}).
		state('createPrograma', {
			url: '/programas/create',
			templateUrl: 'modules/programas/views/create-programa.client.view.html'
		}).
		state('viewPrograma', {
			url: '/programas/:programaId',
			templateUrl: 'modules/programas/views/view-programa.client.view.html'
		}).
		state('editPrograma', {
			url: '/programas/:programaId/edit',
			templateUrl: 'modules/programas/views/edit-programa.client.view.html'
		});
	}
]);
'use strict';

// Programas controller
angular.module('programas').controller('ProgramasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Programas',
	function($scope, $stateParams, $location, Authentication, Programas) {
		$scope.authentication = Authentication;

		// Create new Programa
		$scope.create = function() {
			// Create new Programa object
			var programa = new Programas ({
				name: this.name
			});

			// Redirect after save
			programa.$save(function(response) {
				$location.path('programas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Programa
		$scope.remove = function(programa) {
			if ( programa ) { 
				programa.$remove();

				for (var i in $scope.programas) {
					if ($scope.programas [i] === programa) {
						$scope.programas.splice(i, 1);
					}
				}
			} else {
				$scope.programa.$remove(function() {
					$location.path('programas');
				});
			}
		};

		// Update existing Programa
		$scope.update = function() {
			var programa = $scope.programa;

			programa.$update(function() {
				$location.path('programas/' + programa._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Programas
		$scope.find = function() {
			$scope.programas = Programas.query();
		};

		// Find existing Programa
		$scope.findOne = function() {
			$scope.programa = Programas.get({ 
				programaId: $stateParams.programaId
			});
		};
	}
]);
'use strict';

//Programas service used to communicate Programas REST endpoints
angular.module('programas').factory('Programas', ['$resource',
	function($resource) {
		return $resource('programas/:programaId', { programaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

//Setting up route
angular.module('tipos').config(['$stateProvider',
	function($stateProvider) {
		// Tipos state routing
		$stateProvider.
		state('listTipos', {
			url: '/tipos',
			templateUrl: 'modules/tipos/views/list-tipos.client.view.html'
		}).
		state('createTipo', {
			url: '/tipos/create',
			templateUrl: 'modules/tipos/views/create-tipo.client.view.html'
		}).
		state('viewTipo', {
			url: '/tipos/:tipoId',
			templateUrl: 'modules/tipos/views/view-tipo.client.view.html'
		}).
		state('editTipo', {
			url: '/tipos/:tipoId/edit',
			templateUrl: 'modules/tipos/views/edit-tipo.client.view.html'
		});
	}
]);
'use strict';

// Tipos controller
angular.module('tipos').controller('TiposController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tipos',
	function($scope, $stateParams, $location, Authentication, Tipos) {
		$scope.authentication = Authentication;

		// Create new Tipo
		$scope.create = function() {
			// Create new Tipo object
			var tipo = new Tipos ({
				name: this.name
			});

			// Redirect after save
			tipo.$save(function(response) {
				$location.path('tipos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tipo
		$scope.remove = function(tipo) {
			if ( tipo ) { 
				tipo.$remove();

				for (var i in $scope.tipos) {
					if ($scope.tipos [i] === tipo) {
						$scope.tipos.splice(i, 1);
					}
				}
			} else {
				$scope.tipo.$remove(function() {
					$location.path('tipos');
				});
			}
		};

		// Update existing Tipo
		$scope.update = function() {
			var tipo = $scope.tipo;

			tipo.$update(function() {
				$location.path('tipos/' + tipo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tipos
		$scope.find = function() {
			$scope.tipos = Tipos.query();
		};

		// Find existing Tipo
		$scope.findOne = function() {
			$scope.tipo = Tipos.get({ 
				tipoId: $stateParams.tipoId
			});
		};
	}
]);
'use strict';

//Tipos service used to communicate Tipos REST endpoints
angular.module('tipos').factory('Tipos', ['$resource',
	function($resource) {
		return $resource('tipos/:tipoId', { tipoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('universidads').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Universidades', 'universidads', 'dropdown', '/universidads(/create)?');
		Menus.addSubMenuItem('topbar', 'universidads', 'Listar Universidads', 'universidads');
		Menus.addSubMenuItem('topbar', 'universidads', 'Nueva Universidad', 'universidads/create');
	}
]);
'use strict';

//Setting up route
angular.module('universidads').config(['$stateProvider',
	function($stateProvider) {
		// Universidads state routing
		$stateProvider.
		state('listUniversidads', {
			url: '/universidads',
			templateUrl: 'modules/universidads/views/list-universidads.client.view.html'
		}).
		state('createUniversidad', {
			url: '/universidads/create',
			templateUrl: 'modules/universidads/views/create-universidad.client.view.html'
		}).
		state('viewUniversidad', {
			url: '/universidads/:universidadId',
			templateUrl: 'modules/universidads/views/view-universidad.client.view.html'
		}).
		state('editUniversidad', {
			url: '/universidads/:universidadId/edit',
			templateUrl: 'modules/universidads/views/edit-universidad.client.view.html'
		});
	}
]);
'use strict';

// Universidads controller
angular.module('universidads').controller('UniversidadsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Universidads',
	function($scope, $stateParams, $location, Authentication, Universidads) {
		$scope.authentication = Authentication;

		// Create new Universidad
		$scope.create = function() {
			// Create new Universidad object
			var universidad = new Universidads ({
				name: this.name
			});

			// Redirect after save
			universidad.$save(function(response) {
				$location.path('universidads/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Universidad
		$scope.remove = function(universidad) {
			if ( universidad ) { 
				universidad.$remove();

				for (var i in $scope.universidads) {
					if ($scope.universidads [i] === universidad) {
						$scope.universidads.splice(i, 1);
					}
				}
			} else {
				$scope.universidad.$remove(function() {
					$location.path('universidads');
				});
			}
		};

		// Update existing Universidad
		$scope.update = function() {
			var universidad = $scope.universidad;

			universidad.$update(function() {
				$location.path('universidads/' + universidad._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Universidads
		$scope.find = function() {
			$scope.universidads = Universidads.query();
		};

		// Find existing Universidad
		$scope.findOne = function() {
			$scope.universidad = Universidads.get({ 
				universidadId: $stateParams.universidadId
			});
		};
	}
]);
'use strict';

//Universidads service used to communicate Universidads REST endpoints
angular.module('universidads').factory('Universidads', ['$resource',
	function($resource) {
		return $resource('universidads/:universidadId', { universidadId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
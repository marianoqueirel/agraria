'use strict';

(function() {
	// Tipos Controller Spec
	describe('Tipos Controller Tests', function() {
		// Initialize global variables
		var TiposController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Tipos controller.
			TiposController = $controller('TiposController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tipo object fetched from XHR', inject(function(Tipos) {
			// Create sample Tipo using the Tipos service
			var sampleTipo = new Tipos({
				name: 'New Tipo'
			});

			// Create a sample Tipos array that includes the new Tipo
			var sampleTipos = [sampleTipo];

			// Set GET response
			$httpBackend.expectGET('tipos').respond(sampleTipos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tipos).toEqualData(sampleTipos);
		}));

		it('$scope.findOne() should create an array with one Tipo object fetched from XHR using a tipoId URL parameter', inject(function(Tipos) {
			// Define a sample Tipo object
			var sampleTipo = new Tipos({
				name: 'New Tipo'
			});

			// Set the URL parameter
			$stateParams.tipoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tipos\/([0-9a-fA-F]{24})$/).respond(sampleTipo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tipo).toEqualData(sampleTipo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tipos) {
			// Create a sample Tipo object
			var sampleTipoPostData = new Tipos({
				name: 'New Tipo'
			});

			// Create a sample Tipo response
			var sampleTipoResponse = new Tipos({
				_id: '525cf20451979dea2c000001',
				name: 'New Tipo'
			});

			// Fixture mock form input values
			scope.name = 'New Tipo';

			// Set POST response
			$httpBackend.expectPOST('tipos', sampleTipoPostData).respond(sampleTipoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tipo was created
			expect($location.path()).toBe('/tipos/' + sampleTipoResponse._id);
		}));

		it('$scope.update() should update a valid Tipo', inject(function(Tipos) {
			// Define a sample Tipo put data
			var sampleTipoPutData = new Tipos({
				_id: '525cf20451979dea2c000001',
				name: 'New Tipo'
			});

			// Mock Tipo in scope
			scope.tipo = sampleTipoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tipos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tipos/' + sampleTipoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tipoId and remove the Tipo from the scope', inject(function(Tipos) {
			// Create new Tipo object
			var sampleTipo = new Tipos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tipos array and include the Tipo
			scope.tipos = [sampleTipo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tipos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTipo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tipos.length).toBe(0);
		}));
	});
}());
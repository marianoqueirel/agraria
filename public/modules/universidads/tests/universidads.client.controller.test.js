'use strict';

(function() {
	// Universidads Controller Spec
	describe('Universidads Controller Tests', function() {
		// Initialize global variables
		var UniversidadsController,
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

			// Initialize the Universidads controller.
			UniversidadsController = $controller('UniversidadsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Universidad object fetched from XHR', inject(function(Universidads) {
			// Create sample Universidad using the Universidads service
			var sampleUniversidad = new Universidads({
				name: 'New Universidad'
			});

			// Create a sample Universidads array that includes the new Universidad
			var sampleUniversidads = [sampleUniversidad];

			// Set GET response
			$httpBackend.expectGET('universidads').respond(sampleUniversidads);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.universidads).toEqualData(sampleUniversidads);
		}));

		it('$scope.findOne() should create an array with one Universidad object fetched from XHR using a universidadId URL parameter', inject(function(Universidads) {
			// Define a sample Universidad object
			var sampleUniversidad = new Universidads({
				name: 'New Universidad'
			});

			// Set the URL parameter
			$stateParams.universidadId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/universidads\/([0-9a-fA-F]{24})$/).respond(sampleUniversidad);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.universidad).toEqualData(sampleUniversidad);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Universidads) {
			// Create a sample Universidad object
			var sampleUniversidadPostData = new Universidads({
				name: 'New Universidad'
			});

			// Create a sample Universidad response
			var sampleUniversidadResponse = new Universidads({
				_id: '525cf20451979dea2c000001',
				name: 'New Universidad'
			});

			// Fixture mock form input values
			scope.name = 'New Universidad';

			// Set POST response
			$httpBackend.expectPOST('universidads', sampleUniversidadPostData).respond(sampleUniversidadResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Universidad was created
			expect($location.path()).toBe('/universidads/' + sampleUniversidadResponse._id);
		}));

		it('$scope.update() should update a valid Universidad', inject(function(Universidads) {
			// Define a sample Universidad put data
			var sampleUniversidadPutData = new Universidads({
				_id: '525cf20451979dea2c000001',
				name: 'New Universidad'
			});

			// Mock Universidad in scope
			scope.universidad = sampleUniversidadPutData;

			// Set PUT response
			$httpBackend.expectPUT(/universidads\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/universidads/' + sampleUniversidadPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid universidadId and remove the Universidad from the scope', inject(function(Universidads) {
			// Create new Universidad object
			var sampleUniversidad = new Universidads({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Universidads array and include the Universidad
			scope.universidads = [sampleUniversidad];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/universidads\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUniversidad);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.universidads.length).toBe(0);
		}));
	});
}());
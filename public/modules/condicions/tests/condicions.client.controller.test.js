'use strict';

(function() {
	// Condicions Controller Spec
	describe('Condicions Controller Tests', function() {
		// Initialize global variables
		var CondicionsController,
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

			// Initialize the Condicions controller.
			CondicionsController = $controller('CondicionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Condicion object fetched from XHR', inject(function(Condicions) {
			// Create sample Condicion using the Condicions service
			var sampleCondicion = new Condicions({
				name: 'New Condicion'
			});

			// Create a sample Condicions array that includes the new Condicion
			var sampleCondicions = [sampleCondicion];

			// Set GET response
			$httpBackend.expectGET('condicions').respond(sampleCondicions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.condicions).toEqualData(sampleCondicions);
		}));

		it('$scope.findOne() should create an array with one Condicion object fetched from XHR using a condicionId URL parameter', inject(function(Condicions) {
			// Define a sample Condicion object
			var sampleCondicion = new Condicions({
				name: 'New Condicion'
			});

			// Set the URL parameter
			$stateParams.condicionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/condicions\/([0-9a-fA-F]{24})$/).respond(sampleCondicion);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.condicion).toEqualData(sampleCondicion);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Condicions) {
			// Create a sample Condicion object
			var sampleCondicionPostData = new Condicions({
				name: 'New Condicion'
			});

			// Create a sample Condicion response
			var sampleCondicionResponse = new Condicions({
				_id: '525cf20451979dea2c000001',
				name: 'New Condicion'
			});

			// Fixture mock form input values
			scope.name = 'New Condicion';

			// Set POST response
			$httpBackend.expectPOST('condicions', sampleCondicionPostData).respond(sampleCondicionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Condicion was created
			expect($location.path()).toBe('/condicions/' + sampleCondicionResponse._id);
		}));

		it('$scope.update() should update a valid Condicion', inject(function(Condicions) {
			// Define a sample Condicion put data
			var sampleCondicionPutData = new Condicions({
				_id: '525cf20451979dea2c000001',
				name: 'New Condicion'
			});

			// Mock Condicion in scope
			scope.condicion = sampleCondicionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/condicions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/condicions/' + sampleCondicionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid condicionId and remove the Condicion from the scope', inject(function(Condicions) {
			// Create new Condicion object
			var sampleCondicion = new Condicions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Condicions array and include the Condicion
			scope.condicions = [sampleCondicion];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/condicions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCondicion);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.condicions.length).toBe(0);
		}));
	});
}());
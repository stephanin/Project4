'use strict';

(function() {
	// Diapers Controller Spec
	describe('Diapers Controller Tests', function() {
		// Initialize global variables
		var DiapersController,
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

			// Initialize the Diapers controller.
			DiapersController = $controller('DiapersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Diaper object fetched from XHR', inject(function(Diapers) {
			// Create sample Diaper using the Diapers service
			var sampleDiaper = new Diapers({
				name: 'New Diaper'
			});

			// Create a sample Diapers array that includes the new Diaper
			var sampleDiapers = [sampleDiaper];

			// Set GET response
			$httpBackend.expectGET('diapers').respond(sampleDiapers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.diapers).toEqualData(sampleDiapers);
		}));

		it('$scope.findOne() should create an array with one Diaper object fetched from XHR using a diaperId URL parameter', inject(function(Diapers) {
			// Define a sample Diaper object
			var sampleDiaper = new Diapers({
				name: 'New Diaper'
			});

			// Set the URL parameter
			$stateParams.diaperId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/diapers\/([0-9a-fA-F]{24})$/).respond(sampleDiaper);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.diaper).toEqualData(sampleDiaper);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Diapers) {
			// Create a sample Diaper object
			var sampleDiaperPostData = new Diapers({
				name: 'New Diaper'
			});

			// Create a sample Diaper response
			var sampleDiaperResponse = new Diapers({
				_id: '525cf20451979dea2c000001',
				name: 'New Diaper'
			});

			// Fixture mock form input values
			scope.name = 'New Diaper';

			// Set POST response
			$httpBackend.expectPOST('diapers', sampleDiaperPostData).respond(sampleDiaperResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Diaper was created
			expect($location.path()).toBe('/diapers/' + sampleDiaperResponse._id);
		}));

		it('$scope.update() should update a valid Diaper', inject(function(Diapers) {
			// Define a sample Diaper put data
			var sampleDiaperPutData = new Diapers({
				_id: '525cf20451979dea2c000001',
				name: 'New Diaper'
			});

			// Mock Diaper in scope
			scope.diaper = sampleDiaperPutData;

			// Set PUT response
			$httpBackend.expectPUT(/diapers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/diapers/' + sampleDiaperPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid diaperId and remove the Diaper from the scope', inject(function(Diapers) {
			// Create new Diaper object
			var sampleDiaper = new Diapers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Diapers array and include the Diaper
			scope.diapers = [sampleDiaper];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/diapers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDiaper);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.diapers.length).toBe(0);
		}));
	});
}());
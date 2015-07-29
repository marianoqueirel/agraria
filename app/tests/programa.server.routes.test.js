'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Programa = mongoose.model('Programa'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, programa;

/**
 * Programa routes tests
 */
describe('Programa CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Programa
		user.save(function() {
			programa = {
				name: 'Programa Name'
			};

			done();
		});
	});

	it('should be able to save Programa instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Programa
				agent.post('/programas')
					.send(programa)
					.expect(200)
					.end(function(programaSaveErr, programaSaveRes) {
						// Handle Programa save error
						if (programaSaveErr) done(programaSaveErr);

						// Get a list of Programas
						agent.get('/programas')
							.end(function(programasGetErr, programasGetRes) {
								// Handle Programa save error
								if (programasGetErr) done(programasGetErr);

								// Get Programas list
								var programas = programasGetRes.body;

								// Set assertions
								(programas[0].user._id).should.equal(userId);
								(programas[0].name).should.match('Programa Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Programa instance if not logged in', function(done) {
		agent.post('/programas')
			.send(programa)
			.expect(401)
			.end(function(programaSaveErr, programaSaveRes) {
				// Call the assertion callback
				done(programaSaveErr);
			});
	});

	it('should not be able to save Programa instance if no name is provided', function(done) {
		// Invalidate name field
		programa.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Programa
				agent.post('/programas')
					.send(programa)
					.expect(400)
					.end(function(programaSaveErr, programaSaveRes) {
						// Set message assertion
						(programaSaveRes.body.message).should.match('Please fill Programa name');
						
						// Handle Programa save error
						done(programaSaveErr);
					});
			});
	});

	it('should be able to update Programa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Programa
				agent.post('/programas')
					.send(programa)
					.expect(200)
					.end(function(programaSaveErr, programaSaveRes) {
						// Handle Programa save error
						if (programaSaveErr) done(programaSaveErr);

						// Update Programa name
						programa.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Programa
						agent.put('/programas/' + programaSaveRes.body._id)
							.send(programa)
							.expect(200)
							.end(function(programaUpdateErr, programaUpdateRes) {
								// Handle Programa update error
								if (programaUpdateErr) done(programaUpdateErr);

								// Set assertions
								(programaUpdateRes.body._id).should.equal(programaSaveRes.body._id);
								(programaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Programas if not signed in', function(done) {
		// Create new Programa model instance
		var programaObj = new Programa(programa);

		// Save the Programa
		programaObj.save(function() {
			// Request Programas
			request(app).get('/programas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Programa if not signed in', function(done) {
		// Create new Programa model instance
		var programaObj = new Programa(programa);

		// Save the Programa
		programaObj.save(function() {
			request(app).get('/programas/' + programaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', programa.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Programa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Programa
				agent.post('/programas')
					.send(programa)
					.expect(200)
					.end(function(programaSaveErr, programaSaveRes) {
						// Handle Programa save error
						if (programaSaveErr) done(programaSaveErr);

						// Delete existing Programa
						agent.delete('/programas/' + programaSaveRes.body._id)
							.send(programa)
							.expect(200)
							.end(function(programaDeleteErr, programaDeleteRes) {
								// Handle Programa error error
								if (programaDeleteErr) done(programaDeleteErr);

								// Set assertions
								(programaDeleteRes.body._id).should.equal(programaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Programa instance if not signed in', function(done) {
		// Set Programa user 
		programa.user = user;

		// Create new Programa model instance
		var programaObj = new Programa(programa);

		// Save the Programa
		programaObj.save(function() {
			// Try deleting Programa
			request(app).delete('/programas/' + programaObj._id)
			.expect(401)
			.end(function(programaDeleteErr, programaDeleteRes) {
				// Set message assertion
				(programaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Programa error error
				done(programaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Programa.remove().exec();
		done();
	});
});
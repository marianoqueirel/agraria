'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Condicion = mongoose.model('Condicion'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, condicion;

/**
 * Condicion routes tests
 */
describe('Condicion CRUD tests', function() {
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

		// Save a user to the test db and create new Condicion
		user.save(function() {
			condicion = {
				name: 'Condicion Name'
			};

			done();
		});
	});

	it('should be able to save Condicion instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Condicion
				agent.post('/condicions')
					.send(condicion)
					.expect(200)
					.end(function(condicionSaveErr, condicionSaveRes) {
						// Handle Condicion save error
						if (condicionSaveErr) done(condicionSaveErr);

						// Get a list of Condicions
						agent.get('/condicions')
							.end(function(condicionsGetErr, condicionsGetRes) {
								// Handle Condicion save error
								if (condicionsGetErr) done(condicionsGetErr);

								// Get Condicions list
								var condicions = condicionsGetRes.body;

								// Set assertions
								(condicions[0].user._id).should.equal(userId);
								(condicions[0].name).should.match('Condicion Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Condicion instance if not logged in', function(done) {
		agent.post('/condicions')
			.send(condicion)
			.expect(401)
			.end(function(condicionSaveErr, condicionSaveRes) {
				// Call the assertion callback
				done(condicionSaveErr);
			});
	});

	it('should not be able to save Condicion instance if no name is provided', function(done) {
		// Invalidate name field
		condicion.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Condicion
				agent.post('/condicions')
					.send(condicion)
					.expect(400)
					.end(function(condicionSaveErr, condicionSaveRes) {
						// Set message assertion
						(condicionSaveRes.body.message).should.match('Please fill Condicion name');
						
						// Handle Condicion save error
						done(condicionSaveErr);
					});
			});
	});

	it('should be able to update Condicion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Condicion
				agent.post('/condicions')
					.send(condicion)
					.expect(200)
					.end(function(condicionSaveErr, condicionSaveRes) {
						// Handle Condicion save error
						if (condicionSaveErr) done(condicionSaveErr);

						// Update Condicion name
						condicion.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Condicion
						agent.put('/condicions/' + condicionSaveRes.body._id)
							.send(condicion)
							.expect(200)
							.end(function(condicionUpdateErr, condicionUpdateRes) {
								// Handle Condicion update error
								if (condicionUpdateErr) done(condicionUpdateErr);

								// Set assertions
								(condicionUpdateRes.body._id).should.equal(condicionSaveRes.body._id);
								(condicionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Condicions if not signed in', function(done) {
		// Create new Condicion model instance
		var condicionObj = new Condicion(condicion);

		// Save the Condicion
		condicionObj.save(function() {
			// Request Condicions
			request(app).get('/condicions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Condicion if not signed in', function(done) {
		// Create new Condicion model instance
		var condicionObj = new Condicion(condicion);

		// Save the Condicion
		condicionObj.save(function() {
			request(app).get('/condicions/' + condicionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', condicion.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Condicion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Condicion
				agent.post('/condicions')
					.send(condicion)
					.expect(200)
					.end(function(condicionSaveErr, condicionSaveRes) {
						// Handle Condicion save error
						if (condicionSaveErr) done(condicionSaveErr);

						// Delete existing Condicion
						agent.delete('/condicions/' + condicionSaveRes.body._id)
							.send(condicion)
							.expect(200)
							.end(function(condicionDeleteErr, condicionDeleteRes) {
								// Handle Condicion error error
								if (condicionDeleteErr) done(condicionDeleteErr);

								// Set assertions
								(condicionDeleteRes.body._id).should.equal(condicionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Condicion instance if not signed in', function(done) {
		// Set Condicion user 
		condicion.user = user;

		// Create new Condicion model instance
		var condicionObj = new Condicion(condicion);

		// Save the Condicion
		condicionObj.save(function() {
			// Try deleting Condicion
			request(app).delete('/condicions/' + condicionObj._id)
			.expect(401)
			.end(function(condicionDeleteErr, condicionDeleteRes) {
				// Set message assertion
				(condicionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Condicion error error
				done(condicionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Condicion.remove().exec();
		done();
	});
});
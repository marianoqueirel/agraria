'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tipo = mongoose.model('Tipo'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tipo;

/**
 * Tipo routes tests
 */
describe('Tipo CRUD tests', function() {
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

		// Save a user to the test db and create new Tipo
		user.save(function() {
			tipo = {
				name: 'Tipo Name'
			};

			done();
		});
	});

	it('should be able to save Tipo instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipo
				agent.post('/tipos')
					.send(tipo)
					.expect(200)
					.end(function(tipoSaveErr, tipoSaveRes) {
						// Handle Tipo save error
						if (tipoSaveErr) done(tipoSaveErr);

						// Get a list of Tipos
						agent.get('/tipos')
							.end(function(tiposGetErr, tiposGetRes) {
								// Handle Tipo save error
								if (tiposGetErr) done(tiposGetErr);

								// Get Tipos list
								var tipos = tiposGetRes.body;

								// Set assertions
								(tipos[0].user._id).should.equal(userId);
								(tipos[0].name).should.match('Tipo Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tipo instance if not logged in', function(done) {
		agent.post('/tipos')
			.send(tipo)
			.expect(401)
			.end(function(tipoSaveErr, tipoSaveRes) {
				// Call the assertion callback
				done(tipoSaveErr);
			});
	});

	it('should not be able to save Tipo instance if no name is provided', function(done) {
		// Invalidate name field
		tipo.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipo
				agent.post('/tipos')
					.send(tipo)
					.expect(400)
					.end(function(tipoSaveErr, tipoSaveRes) {
						// Set message assertion
						(tipoSaveRes.body.message).should.match('Please fill Tipo name');
						
						// Handle Tipo save error
						done(tipoSaveErr);
					});
			});
	});

	it('should be able to update Tipo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipo
				agent.post('/tipos')
					.send(tipo)
					.expect(200)
					.end(function(tipoSaveErr, tipoSaveRes) {
						// Handle Tipo save error
						if (tipoSaveErr) done(tipoSaveErr);

						// Update Tipo name
						tipo.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tipo
						agent.put('/tipos/' + tipoSaveRes.body._id)
							.send(tipo)
							.expect(200)
							.end(function(tipoUpdateErr, tipoUpdateRes) {
								// Handle Tipo update error
								if (tipoUpdateErr) done(tipoUpdateErr);

								// Set assertions
								(tipoUpdateRes.body._id).should.equal(tipoSaveRes.body._id);
								(tipoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tipos if not signed in', function(done) {
		// Create new Tipo model instance
		var tipoObj = new Tipo(tipo);

		// Save the Tipo
		tipoObj.save(function() {
			// Request Tipos
			request(app).get('/tipos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tipo if not signed in', function(done) {
		// Create new Tipo model instance
		var tipoObj = new Tipo(tipo);

		// Save the Tipo
		tipoObj.save(function() {
			request(app).get('/tipos/' + tipoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tipo.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tipo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tipo
				agent.post('/tipos')
					.send(tipo)
					.expect(200)
					.end(function(tipoSaveErr, tipoSaveRes) {
						// Handle Tipo save error
						if (tipoSaveErr) done(tipoSaveErr);

						// Delete existing Tipo
						agent.delete('/tipos/' + tipoSaveRes.body._id)
							.send(tipo)
							.expect(200)
							.end(function(tipoDeleteErr, tipoDeleteRes) {
								// Handle Tipo error error
								if (tipoDeleteErr) done(tipoDeleteErr);

								// Set assertions
								(tipoDeleteRes.body._id).should.equal(tipoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tipo instance if not signed in', function(done) {
		// Set Tipo user 
		tipo.user = user;

		// Create new Tipo model instance
		var tipoObj = new Tipo(tipo);

		// Save the Tipo
		tipoObj.save(function() {
			// Try deleting Tipo
			request(app).delete('/tipos/' + tipoObj._id)
			.expect(401)
			.end(function(tipoDeleteErr, tipoDeleteRes) {
				// Set message assertion
				(tipoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tipo error error
				done(tipoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tipo.remove().exec();
		done();
	});
});
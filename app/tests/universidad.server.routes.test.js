'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Universidad = mongoose.model('Universidad'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, universidad;

/**
 * Universidad routes tests
 */
describe('Universidad CRUD tests', function() {
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

		// Save a user to the test db and create new Universidad
		user.save(function() {
			universidad = {
				name: 'Universidad Name'
			};

			done();
		});
	});

	it('should be able to save Universidad instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Universidad
				agent.post('/universidads')
					.send(universidad)
					.expect(200)
					.end(function(universidadSaveErr, universidadSaveRes) {
						// Handle Universidad save error
						if (universidadSaveErr) done(universidadSaveErr);

						// Get a list of Universidads
						agent.get('/universidads')
							.end(function(universidadsGetErr, universidadsGetRes) {
								// Handle Universidad save error
								if (universidadsGetErr) done(universidadsGetErr);

								// Get Universidads list
								var universidads = universidadsGetRes.body;

								// Set assertions
								(universidads[0].user._id).should.equal(userId);
								(universidads[0].name).should.match('Universidad Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Universidad instance if not logged in', function(done) {
		agent.post('/universidads')
			.send(universidad)
			.expect(401)
			.end(function(universidadSaveErr, universidadSaveRes) {
				// Call the assertion callback
				done(universidadSaveErr);
			});
	});

	it('should not be able to save Universidad instance if no name is provided', function(done) {
		// Invalidate name field
		universidad.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Universidad
				agent.post('/universidads')
					.send(universidad)
					.expect(400)
					.end(function(universidadSaveErr, universidadSaveRes) {
						// Set message assertion
						(universidadSaveRes.body.message).should.match('Please fill Universidad name');
						
						// Handle Universidad save error
						done(universidadSaveErr);
					});
			});
	});

	it('should be able to update Universidad instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Universidad
				agent.post('/universidads')
					.send(universidad)
					.expect(200)
					.end(function(universidadSaveErr, universidadSaveRes) {
						// Handle Universidad save error
						if (universidadSaveErr) done(universidadSaveErr);

						// Update Universidad name
						universidad.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Universidad
						agent.put('/universidads/' + universidadSaveRes.body._id)
							.send(universidad)
							.expect(200)
							.end(function(universidadUpdateErr, universidadUpdateRes) {
								// Handle Universidad update error
								if (universidadUpdateErr) done(universidadUpdateErr);

								// Set assertions
								(universidadUpdateRes.body._id).should.equal(universidadSaveRes.body._id);
								(universidadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Universidads if not signed in', function(done) {
		// Create new Universidad model instance
		var universidadObj = new Universidad(universidad);

		// Save the Universidad
		universidadObj.save(function() {
			// Request Universidads
			request(app).get('/universidads')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Universidad if not signed in', function(done) {
		// Create new Universidad model instance
		var universidadObj = new Universidad(universidad);

		// Save the Universidad
		universidadObj.save(function() {
			request(app).get('/universidads/' + universidadObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', universidad.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Universidad instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Universidad
				agent.post('/universidads')
					.send(universidad)
					.expect(200)
					.end(function(universidadSaveErr, universidadSaveRes) {
						// Handle Universidad save error
						if (universidadSaveErr) done(universidadSaveErr);

						// Delete existing Universidad
						agent.delete('/universidads/' + universidadSaveRes.body._id)
							.send(universidad)
							.expect(200)
							.end(function(universidadDeleteErr, universidadDeleteRes) {
								// Handle Universidad error error
								if (universidadDeleteErr) done(universidadDeleteErr);

								// Set assertions
								(universidadDeleteRes.body._id).should.equal(universidadSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Universidad instance if not signed in', function(done) {
		// Set Universidad user 
		universidad.user = user;

		// Create new Universidad model instance
		var universidadObj = new Universidad(universidad);

		// Save the Universidad
		universidadObj.save(function() {
			// Try deleting Universidad
			request(app).delete('/universidads/' + universidadObj._id)
			.expect(401)
			.end(function(universidadDeleteErr, universidadDeleteRes) {
				// Set message assertion
				(universidadDeleteRes.body.message).should.match('User is not logged in');

				// Handle Universidad error error
				done(universidadDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Universidad.remove().exec();
		done();
	});
});
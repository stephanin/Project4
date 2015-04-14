'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Diaper = mongoose.model('Diaper'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, diaper;

/**
 * Diaper routes tests
 */
describe('Diaper CRUD tests', function() {
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

		// Save a user to the test db and create new Diaper
		user.save(function() {
			diaper = {
				name: 'Diaper Name'
			};

			done();
		});
	});

	it('should be able to save Diaper instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Diaper
				agent.post('/diapers')
					.send(diaper)
					.expect(200)
					.end(function(diaperSaveErr, diaperSaveRes) {
						// Handle Diaper save error
						if (diaperSaveErr) done(diaperSaveErr);

						// Get a list of Diapers
						agent.get('/diapers')
							.end(function(diapersGetErr, diapersGetRes) {
								// Handle Diaper save error
								if (diapersGetErr) done(diapersGetErr);

								// Get Diapers list
								var diapers = diapersGetRes.body;

								// Set assertions
								(diapers[0].user._id).should.equal(userId);
								(diapers[0].name).should.match('Diaper Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Diaper instance if not logged in', function(done) {
		agent.post('/diapers')
			.send(diaper)
			.expect(401)
			.end(function(diaperSaveErr, diaperSaveRes) {
				// Call the assertion callback
				done(diaperSaveErr);
			});
	});

	it('should not be able to save Diaper instance if no name is provided', function(done) {
		// Invalidate name field
		diaper.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Diaper
				agent.post('/diapers')
					.send(diaper)
					.expect(400)
					.end(function(diaperSaveErr, diaperSaveRes) {
						// Set message assertion
						(diaperSaveRes.body.message).should.match('Please fill Diaper name');
						
						// Handle Diaper save error
						done(diaperSaveErr);
					});
			});
	});

	it('should be able to update Diaper instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Diaper
				agent.post('/diapers')
					.send(diaper)
					.expect(200)
					.end(function(diaperSaveErr, diaperSaveRes) {
						// Handle Diaper save error
						if (diaperSaveErr) done(diaperSaveErr);

						// Update Diaper name
						diaper.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Diaper
						agent.put('/diapers/' + diaperSaveRes.body._id)
							.send(diaper)
							.expect(200)
							.end(function(diaperUpdateErr, diaperUpdateRes) {
								// Handle Diaper update error
								if (diaperUpdateErr) done(diaperUpdateErr);

								// Set assertions
								(diaperUpdateRes.body._id).should.equal(diaperSaveRes.body._id);
								(diaperUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Diapers if not signed in', function(done) {
		// Create new Diaper model instance
		var diaperObj = new Diaper(diaper);

		// Save the Diaper
		diaperObj.save(function() {
			// Request Diapers
			request(app).get('/diapers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Diaper if not signed in', function(done) {
		// Create new Diaper model instance
		var diaperObj = new Diaper(diaper);

		// Save the Diaper
		diaperObj.save(function() {
			request(app).get('/diapers/' + diaperObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', diaper.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Diaper instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Diaper
				agent.post('/diapers')
					.send(diaper)
					.expect(200)
					.end(function(diaperSaveErr, diaperSaveRes) {
						// Handle Diaper save error
						if (diaperSaveErr) done(diaperSaveErr);

						// Delete existing Diaper
						agent.delete('/diapers/' + diaperSaveRes.body._id)
							.send(diaper)
							.expect(200)
							.end(function(diaperDeleteErr, diaperDeleteRes) {
								// Handle Diaper error error
								if (diaperDeleteErr) done(diaperDeleteErr);

								// Set assertions
								(diaperDeleteRes.body._id).should.equal(diaperSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Diaper instance if not signed in', function(done) {
		// Set Diaper user 
		diaper.user = user;

		// Create new Diaper model instance
		var diaperObj = new Diaper(diaper);

		// Save the Diaper
		diaperObj.save(function() {
			// Try deleting Diaper
			request(app).delete('/diapers/' + diaperObj._id)
			.expect(401)
			.end(function(diaperDeleteErr, diaperDeleteRes) {
				// Set message assertion
				(diaperDeleteRes.body.message).should.match('User is not logged in');

				// Handle Diaper error error
				done(diaperDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Diaper.remove().exec();
		done();
	});
});
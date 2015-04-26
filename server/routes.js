// routes.js
// this handles the URL and states of our application.
var home = require('../controllers/home');
var image = require('../controllers/image');
var users = require('../controllers/user');
var passport = require('passport');



module.exports.initialize = function(app, router) {
	//handles browser requests for images
	app.get('/', home.index);
	app.get('/images/:image_id', image.index);
	
	//handles post routes (like a form submission)
	app.post('/images', image.create);
	app.post('/images/:image_id/like', image.like);
	app.post('/images/:image_id/comment', image.comment );   	// `wild card fields` :image_id
	
	app.use('/', router);


	//*****our new routes handle the sign up and sign in views and actions
	app.get('/signup', users.renderSignup);
	app.post('/signup', users.signup);
	app.route('/signin')
		.get(users.renderSignin)
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/signin',
			//*****displays an error message or welcome depending on authentication
			failureFlash: true,
	          successFlash: 'Welcome!'
		}));
	app.get('/signout', users.signout);
};
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Diaper = mongoose.model('Diaper'),
	_ = require('lodash');

/**
 * Create a Diaper
 */
exports.create = function(req, res) {
	var diaper = new Diaper(req.body);
	diaper.user = req.user;

	diaper.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(diaper);
		}
	});
};

/**
 * Show the current diaper
 */
exports.read = function(req, res) {
	res.jsonp(req.diaper);
};

/**
 * Update a Diaper
 */
exports.update = function(req, res) {
	var diaper = req.diaper ;

	diaper = _.extend(diaper , req.body);

	diaper.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(diaper);
		}
	});
};

/**
 * Delete an Diaper
 */
exports.delete = function(req, res) {
	var diaper = req.diaper ;

	diaper.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(diaper);
		}
	});
};

/**
 * List of Diapers
 */
exports.list = function(req, res) { 
	Diaper.find().sort('-created').populate('user', 'displayName').exec(function(err, diapers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(diapers);
		}
	});
};

/**
 * Diaper middleware
 */
exports.diaperByID = function(req, res, next, id) { 
	Diaper.findById(id).populate('user', 'displayName').exec(function(err, diaper) {
		if (err) return next(err);
		if (! diaper) return next(new Error('Failed to load Diaper ' + id));
		req.diaper = diaper ;
		next();
	});
};

/**
 * Diaper authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.diaper.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

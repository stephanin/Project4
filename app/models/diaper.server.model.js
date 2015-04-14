'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* Feed Schema
 */
var DiaperSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	timeFeed: {
		type: Number,
		default: 0,
		min: 0,
		max: 46
	},
	bottle: {
		type: Boolean,
		default: false
	},
	breast: {
		type: Boolean,
		default: false
	},
	amount: {
		type: Number,
		default: 0,
		min: 0,
		max: 39
	},
	comment: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('Diaper', DiaperSchema);
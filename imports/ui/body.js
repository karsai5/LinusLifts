import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'

import { Trips } from '../api/trips.js';

import './usercheckbox.js';
import './trip.js';
import './body.html';

var currentTrip = function() {
	if (Session.get("trip")) {
		return Trips.findOne(Session.get('trip'));
	} else {
		return null;
	}
};

Template.body.helpers({
	trips() {
		return Trips.find({}, { sort: { start: -1 }, limit: 5 });
	},
	currentTrip: currentTrip,
	isAdmin() {
		try {
			if (Meteor.user().services.facebook.id == "10206344163361361") {
				return true;
			}
		} catch (err) {
			return false;
		}
	},
	userList() {
		return Meteor.users.find({});
	}
});

Template.body.events({
	'click #start-trip'(event) {
		// prevent default browser submit
		event.preventDefault();

		// create new trip
		var id = Trips.insert({
			start: new Date(),
			end: new Date(),
			points: new Array(),
			users: new Array(),
		});

		// update session variable
		Session.set("trip", id);
		console.log(Trips.findOne(currentTrip()._id));
		// get location permission
		console.log(Geolocation.currentLocation());

		// loop to add points
		var pointLoop = setInterval(function() {

			if (currentTrip()) {
				trip = Trips.findOne(currentTrip()._id);
				geolocation = Geolocation.latLng();

				Trips.update(trip._id, {
					$push: { points: geolocation },
				});
			} else {
				clearInterval(pointLoop);
			}

		}, 5000);
	},
	'submit .trip-details'(event, instance) {
		// prevent the default browser submit
		event.preventDefault();

		// update the current trip
		Trips.update(currentTrip()._id, {
			$set: { end: new Date() },
		});

		// update the session
		Session.set("trip", null);
	},
	'keyup .trip-details .title'(event) {
		const text = event.target.value;
		Trips.update(currentTrip()._id, {
			$set: {text: text},
		});
	},
	'change .trip-details .trip-users input'(event) {
		if ($(event.target).is(":checked")) {
			console.log('added user');
			Trips.update(currentTrip()._id, {
				$push: { users: this },
			});
		} else {
			console.log('removed user');
			Trips.update(currentTrip()._id, {
				$pull: { users: this },
			});
		}
		console.log(event);
		console.log(this);
	},
});

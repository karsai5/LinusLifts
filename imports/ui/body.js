/**
 * @file Body Javascript
 * @author Linus Karsai <karsai5@gmail.com>
 * @version 0.1
 */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'

import { Trips } from '../api/trips.js';

import './usertable.js';
import './usercheckbox.js';
import './trip.js';
import './body.html';

var currentTrip = function() {
	/**
	 * Get the current trip from the browser session. If no 
	 * session exists then it returns null.
	 *
	 * @returns {Session} or null
	 */
	if (Session.get("trip")) {
		return Trips.findOne(Session.get('trip'));
	} else {
		return null;
	}
};

Template.body.helpers({
	trips() {
		/**
		 * Gets five trips.
		 *
		 * @returns {Trips} collection
		 */
		return Trips.find({}, { sort: { start: -1 }, limit: 5 });
	},
	currentTrip: currentTrip,
	isAdmin() {
		/**
		 * This is pretty hacky, but it checks if the current user has the 
		 * facebook id of me. If so then it returns true, otherwise false.
		 *
		 * @returns {Boolean} stating if admin or not
		 */
		try {
			if (Meteor.user().services.facebook.id == "10206344163361361") {
				return true;
			}
		} catch (err) {
			return false;
		}
	},
	users() {
		/**
		 * Gets a collection of all the users.
		 *
		 * @returns {Users} collection.
		 */
		return Meteor.users.find({});
	},
});

Template.body.events({
	'click #start-trip'(event) {
		/**
		 * Triggered when clicking the start trip button.
		 * It creates a new trip in the database and updates
		 * the session variable so that we know there's a currently
		 * running trip. 
		 * It also starts a loop that adds a location point every five
		 * seconds.
		 */
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
		// get location permission
		console.log(Geolocation.currentLocation());

		// loop to add points
		var pointLoop = setInterval(function() {

			// check that we're currently in a trip, else stop the loop.
			if (currentTrip()) {
				// get the actual curren trip.
				trip = Trips.findOne(currentTrip()._id);
				geolocation = Geolocation.latLng();

				Trips.update(trip._id, {
					// add a geolocation point to the object
					$push: { points: geolocation },
				});
			} else {
				clearInterval(pointLoop);
			}

		}, 5000);
	},
	'submit .trip-details'(event, instance) {
		/**
		 * This runs when the user submits the current trip form. 
		 * It adds an end time to the trip and sets the trip variable
		 * from the session to null
		 */
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
		/**
		 * Whenever the title of the trip is changed in the current
		 * trip form it is updated in the trip collection.
		 */
		const text = event.target.value;
		Trips.update(currentTrip()._id, {
			$set: {text: text},
		});
	},
	'change .trip-details .trip-users input'(event) {
		/**
		 * When a users checkbox is changed in the trip form to 
		 * indicate that they are in the current trip, we remove 
		 * or add it to the trip entity as needed.
		 */
		if ($(event.target).is(":checked")) {
			Trips.update(currentTrip()._id, {
				// oh yea, adds to the db without having to grab the whole
				// object
				$push: { users: this },
			});
		} else {
			Trips.update(currentTrip()._id, {
				// same as above, removes from the users array without having
				// to update the whole object client side 
				$pull: { users: this },
			});
		}
	},
});

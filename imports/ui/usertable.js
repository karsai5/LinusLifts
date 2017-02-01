/**
 * @file UserTable template Javascript
 * @author Linus Karsai <karsai5@gmail.com>
 * @version 0.1
 */

import { Template } from 'meteor/templating';

import { Trips } from '../api/trips.js';
import { distance } from '../helpers/distance.js';

import './usertable.html';

var getTrips = function(user) {
	/**
	 * Gets all the trips attributed to a user.
	 *
	 * @returns {Array} of trips
	 */
	count = 0;
	// TODO: clean this up to be more efficient.
	trips = Trips.find({}).fetch();
	results = [];

	// loop through trips
	for (key in trips) {
		var trip = trips[key];
		for (userkey in trip.users) {
			u = trip.users[userkey];
			if (u._id == user._id) {
				results.push(trip);
			}
		}
	}
	return results;
};

Template.usertable.helpers({
	name() {
		/**
		 * Return the users preferred name
		 *
		 * @return {String} username
		 */
		if (this.services.facebook) {
			return this.services.facebook.name;
		}
		return this.username;
	},
	getTrips() {
		/**
		 * Returns all the users trips
		 */
		return getTrips(this);
	},
	countTrips() {
		/**
		 * Gets all the users trips and counts them...
		 */
		return getTrips(this).length;
	},
	getDistance() {
		/**
		 * Iterates through all the trips and grabs the distance of each array
		 * of geopoints.
		 *
		 * @return {String} distance in km
		 */ 
		trips = getTrips(this);
		totalDistance = 0;
		for (key in trips) {
			trip = trips[key];
			total = 0;
			if (trip.points && trip.points.length > 1) {
				for(x = 0; x < trip.points.length-1; x++) {
					pointA = trip.points[x];
					pointB = trip.points[x+1];
					dist = distance(pointA.lat, pointA.lng, pointB.lat, pointB.lng, "K");
					total = total + dist;
				}
			}
			totalDistance = totalDistance + total;
		}
		return parseFloat(totalDistance.toFixed(0)) + "km";
	},
});

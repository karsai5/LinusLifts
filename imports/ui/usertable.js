import { Template } from 'meteor/templating';

import { Trips } from '../api/trips.js';
import { distance } from '../helpers/distance.js';

import './usertable.html';

var getTrips = function(user) {
	count = 0;
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
		if (this.services.facebook) {
			return this.services.facebook.name;
		}
		return this.username;
	},
	getTrips() {
		return getTrips(this);
	},
	countTrips() {
		return getTrips(this).length;
	},
	getDistance() {
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

import { Template } from 'meteor/templating';

import { Trips } from '../api/trips.js';

import './trip.html';
import { distance } from '../helpers/distance.js';

var monthNames = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
var dayNames = [
	"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
]

var getNiceDate = function(date) {
	var day = date.getDay();
	var dayIndex = date.getDay();
	var monthIndex = date.getMonth();
	var month = monthNames[monthIndex];
	var year = date.getFullYear();
	return dayNames[dayIndex] + ', ' + day + ' ' + month;
}

Template.trip.helpers({
	getDistance() {
		// if there's any points count them
		total = 0;
		if (this.points && this.points.length > 1) {
			for(x = 0; x < this.points.length-1; x++) {
				pointA = this.points[x];
				pointB = this.points[x+1];
				dist = distance(pointA.lat, pointA.lng, pointB.lat, pointB.lng, "K");
				total = total + dist;
			}
		}

		return parseFloat(total.toFixed(0)) + "km";
	},
	getPoints() {
		if (this.points) {
			return this.points.length;
		}
		return 0;
	},
	getStart() {
		return getNiceDate(this.start);
	},
	getDuration() {
		var timeDiff = Math.abs(this.start.getTime() - this.end.getTime());
		var diffMinutes = Math.ceil(timeDiff / (1000 * 60));
		return diffMinutes + 'min';		
	},
	getUsers() {
		usernames = []
		for (u of this.users) {
			if (u.services.facebook) {
				usernames.push(u.services.facebook.name);
			} else {
				usernames.push(u.username);
			}
		}
		return usernames.join(', ');
	},
});

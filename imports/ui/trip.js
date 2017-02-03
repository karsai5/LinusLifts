/**
 * @file Trip Javascript
 * @author Linus Karsai <karsai5@gmail.com>
 * @version 0.1
 */

import { Template } from 'meteor/templating';

import { Trips } from '../api/trips.js';

import './trip.html';


var getNiceDate = function(date) {
	/**
	 * Returns the date as an arguably prettier string.
	 * Example: Mon, 7 May
	 *
	 * @param {Date} date - The date you want printed
	 * @return {String} The date in format dayOfWeek, day month
	 */
	var monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	var dayNames = [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
	]
	var day = date.getDay();
	var dayIndex = date.getDay();
	var monthIndex = date.getMonth();
	var month = monthNames[monthIndex];
	var year = date.getFullYear();
	return dayNames[dayIndex] + ', ' + day + ' ' + month;
}

Template.trip.helpers({
	getDistance() {
		/**
		 * Grabs the distance from the database.
		 *
		 * @return {String} distance in kilometers e.g. 5km
		 */

		return parseFloat(this.distance.toFixed(0)) + "km";
	},
	getPointCount() {
		/**
		 * Get's the number of geo points in a trip.
		 *
		 * @return {int} number of geo points.
		 */
		if (this.points) {
			return this.points.length;
		}
		return 0;
	},
	getStart() {
		/**
		 * Returns the trip start date using the nice date method.
		 *
		 * @return {String} pretty trip start date
		 */
		return getNiceDate(this.start);
	},
	getDuration() {
		/** 
		 * Calculates the trip duration using the start and end time, 
		 * printing out the overall trip duration in minutes.
		 *
		 * @return {String} number of minutes e.g. 10min
		 */
		var timeDiff = Math.abs(this.start.getTime() - this.end.getTime());
		var diffMinutes = Math.ceil(timeDiff / (1000 * 60));
		return diffMinutes + 'min';
	},
	getUserList() {
		/**
		 * Returns a comma separated list of users who where on the trip.
		 * 
		 * @return {String} List of users
		 */
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

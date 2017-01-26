import { Template } from 'meteor/templating';

import { Trips } from '../api/trips.js';

import './trip.html';

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at http://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: http://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2015            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

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
	}
});

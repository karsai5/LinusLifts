/**
 * @file UserCheckbox Template Javascript

 * @author Linus Karsai <karsai5@gmail.com>
 * @version 0.1
 */

import './usercheckbox.html';

import { Template } from 'meteor/templating';

Template.usercheckbox.helpers({
	facebookid() {
		/**
		 * Returns the facebook id of a user if they're a facebook account,
		 * otherwise it return null.
		 */
		if (this.services.facebook) {
			return this.services.facebook.id;
		}
		return null;
	},
	username() {
		/**
		 * Grabs the username of a user.
		 */
		if (this.services.facebook) {
			return this.services.facebook.name;
		}
		return this.username;
	},
	userid() {
		/**
		 * Returns the user ID.
		 */
		return this._id;
	},
});

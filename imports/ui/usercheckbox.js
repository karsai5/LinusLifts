import './usercheckbox.html';

import { Template } from 'meteor/templating';

Template.usercheckbox.helpers({
	userDetails() {
		console.log(this);
	},
	facebookid() {
		// if it's a facebook user return the facebook 
		// id otherise return null
		if (this.services.facebook) {
			return this.services.facebook.id;
		}
		return null;
	},
	username() {
		if (this.services.facebook) {
			return this.services.facebook.name;
		}
		return this.username;
	},
	userid() {
		return this._id;
	},
});

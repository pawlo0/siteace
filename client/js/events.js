/* global Websites */

Template.website_form.events({
	// Only show the add new website form in case user is loggin
	"click .js-toggle-website-form":function(event){
		if (Meteor.user()) {
			$("a.js-toggle-website-form").popover('hide');
			$("#website_form").modal('show');
		} else {
			$("a.js-toggle-website-form").popover('toggle');
		}
	}, 
	"submit .js-save-website-form":function(event){
		if (!event.target.url.value){
			$("#url_formGroup").addClass('has-error');
			$("#url").attr("placeholder", "Must add an URL");
		} else if (!event.target.description.value) {
			$("#description_formGroup").addClass('has-error');
			$("#description").attr("placeholder", "Must add a description");
		} else {
			if (event.target.title.value) {
				var title = event.target.title.value;
			} else {
				var title = event.target.url.value
			}
			if (Meteor.user()){
				Websites.insert({
			  		title: title, 
			  		url: event.target.url.value, 
			  		description: event.target.description.value, 
			  		createdBy: Meteor.user()._id,
			  		createdOn: new Date()
				});		
			}
			$("#website_form").modal('hide');			
		}
		
		return false;// stop the form submit from reloading the page

	}
});

Template.website_item.events({
	"click .js-upvote":function(event){
		if (Meteor.user()){
			if (!this.rating || isNaN(this.rating)) {
				var newrate = 1;
			} else {
				var newrate = this.rating + 1;
			};
			Websites.update({_id: this._id}, {$set: {rating: newrate}});			
		} else {
			$('#upvote-'+this._id).popover('toggle');
		}

		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){
		if (Meteor.user()){
			if (!this.rating || isNaN(this.rating)) {
				var newrate = -1;
			} else {
				var newrate = this.rating - 1;
			};
			Websites.update({_id: this._id}, {$set: {rating: newrate}});			
		} else {
			$('#upvote-'+this._id).popover('toggle');
		}

		return false;// prevent the button from reloading the page
	}
})
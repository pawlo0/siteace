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
			var userId = Meteor.user()._id;
			if ($.inArray(userId, this.upvotes) == -1) {
				Websites.update({_id: this._id}, {$push: {upvotes: userId}});
				Websites.update({_id: this._id}, {$pull: {downvotes: userId}});
			} else {
				Websites.update({_id: this._id}, {$pull: {upvotes: userId}});
			}
			
		} else {
			$('#upvote-'+this._id).popover('toggle');
		}

		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){
		if (Meteor.user()){
			var userId = Meteor.user()._id;
			if ($.inArray(userId, this.downvotes) == -1) {
				Websites.update({_id: this._id}, {$push: {downvotes: userId}});
				Websites.update({_id: this._id}, {$pull: {upvotes: userId}});
			} else {
				Websites.update({_id: this._id}, {$pull: {downvotes: userId}});
			}
		} else {
			$('#downvote-'+this._id).popover('toggle');
		}

		return false;// prevent the button from reloading the page
	},
	"mouseover .js-upvote":function(event){
		if (Meteor.user()){
			var userId = Meteor.user()._id;
			if ($.inArray(userId, this.upvotes) == -1 && $.inArray(userId, this.downvotes) == -1) {
				$('#upvote-'+this._id).attr('title', "Click to give an Up Vote.");
			} else if ($.inArray(userId, this.downvotes) != -1) {
				$('#upvote-'+this._id).attr('title', "You already voted a negative feedback. Click if you want to change your opinion.");
			} else {
				$('#upvote-'+this._id).attr('title', "You already Up voted. Click again to remove your vote.");
			}
		} else {
			$('#upvote-'+this._id).attr('title', "Please login if you want to vote.");
		}
	},
	"mouseover .js-downvote":function(event){
		if (Meteor.user()){
			var userId = Meteor.user()._id;
			if ($.inArray(userId, this.upvotes) == -1 && $.inArray(userId, this.downvotes) == -1) {
				$('#downvote-'+this._id).attr('title', "Click to give an Down Vote.");
			} else if ($.inArray(userId, this.upvotes) != -1) {
				$('#downvote-'+this._id).attr('title', "You already voted a positive feedback. Click if you want to change your opinion.");
			} else {
				$('#downvote-'+this._id).attr('title', "You already Down voted. Click again to remove your vote.");
			}
		} else {
			$('#downvote-'+this._id).attr('title', "Please login if you want to vote.");
		}
	}	
})
/* global Websites Comments*/

Template.website_list.events({
	"click .js-toggle-website-form":function(event){
		if (Meteor.user()) {
			$("a.js-toggle-website-form").popover('hide');
			$("#website_form").modal('show');
		} else {
			$("a.js-toggle-website-form").popover('toggle');
		}
	}
})
Template.website_form.events({
	// Only show the add new website form in case user is loggin
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
			$('#upvote-'+this._id).attr('title', "Please login to vote.");
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
			$('#downvote-'+this._id).attr('title', "Please login to vote.");
		}
	},
	"click .js-website_item":function(event){
		window.location = "/websites/"+this._id;
		return false;
	}
});

Template.website_details.events({
	"submit .js-save-comment":function(event){
		if (Meteor.user()){
			$('#notLoggedIn').hide();
			if (event.target.input_comment.value){
				Comments.insert({
					websiteId: this._id,
					comment_body: event.target.input_comment.value,
					createdOn: new Date(),
					createdBy: Meteor.user()._id
				})				
			}
		} else {
			$('#notLoggedIn').show();
		}
		return false;
	},
	"click .js-delete-website":function(event){
		if (Meteor.user()) {
			if (Meteor.user()._id == this.createdBy) {
				Websites.remove({_id: this._id});
				var commentsForThisSite = Comments.find({websiteId: this._id}).fetch();
				for (var i=0; i < commentsForThisSite.length; i++){
					Comments.remove({_id: commentsForThisSite[i]._id});
				}
				window.location = "/websites"
			} else {
				$('.js-delete-website').attr('title', "You must be the author to delete this website.");
			}
		} else {
			$('.js-delete-website').attr('title', "Login to delete websites.");
		}
	},
	"mouseover .js-delete-website":function(event){
		if (Meteor.user()) {
			if (Meteor.user()._id == this.createdBy) {
				$('.js-delete-website').attr('title', "Delete this website. Warning! This will also delete all comments about this website.");
			} else {
				$('.js-delete-website').attr('title', "You must be the author of this website if you want to delete it.");
			}
		} else {
			$('.js-delete-website').attr('title', "Login to delete websites.");
		}		
	},
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
			$('#upvote-'+this._id).attr('title', "Please login to vote.");
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
			$('#downvote-'+this._id).attr('title', "Please login to vote.");
		}
	}	
});

Template.comments_list.events({
	"click .js-delete-comment":function(event){
		if (Meteor.user()) {
			if (Meteor.user()._id == this.createdBy) {
				Comments.remove({_id: this._id});
			} else {
				$('.js-delete-comment').attr('title', "You must be the author of this comment if you want to delete it.");
			}
		} else {
			$('.js-delete-comment').attr('title', "Login to delete comments.");
		}
		return false
	},
	"mouseover .js-delete-comment":function(event){
		if (Meteor.user()) {
			if (Meteor.user()._id == this.createdBy) {
				$('.js-delete-comment').attr('title', "Delete comment.");;
			} else {
				$('.js-delete-comment').attr('title', "You must be the author of this comment if you want to delete it.");
			}
		} else {
			$('.js-delete-comment').attr('title', "Login to delete comments.");
		}		
	}
});
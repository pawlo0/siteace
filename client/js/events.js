/* global Websites Comments*/

Template.navbar.events({
	"keyup #srch-term":function(event){
		Session.set("searchValue", event.target.value);
	}
});

Template.website_list.events({
	"click .js-toggle-website-form":function(event){
		if (Meteor.user()) {
			$("a.js-toggle-website-form").popover('hide');
			$("#website_form").modal('show');
		} else {
			$("a.js-toggle-website-form").popover('toggle');
		}
	},
	"click .js-clear-search":function(){
		Session.set("searchValue", undefined);
		$("#srch-term").val("");
	}
})

Template.website_form.events({
	// Only show the add new website form in case user is loggin
	"submit .js-save-website-form":function(event){
		var title, logoURL;
		if (!event.target.url.value){
			$("#url_formGroup").addClass('has-error');
			$("#url").attr("placeholder", "Must add an URL");
		} else if (!event.target.description.value) {
			$("#description_formGroup").addClass('has-error');
			$("#description").attr("placeholder", "Must add a description");
		} else {
			if (event.target.title.value) {
				title = event.target.title.value;
			} else {
				title = event.target.url.value;
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

	},
	"keyup #url":function(event){
		var url = $("#url").val();
		if (url.substring(0,7).toLowerCase() != "http://"){
			url = "http://"+url;
			$("#url").val(url);
		}
		console.log(url)
		Meteor.call("getResponse", url, function(error, data){
			if (error){
				$("#retrieveAlert").text('Impossible to retrieve information.').addClass("text-warning");
			} else {
				if (data != undefined){
					var str = data.content;
					var el = document.createElement( 'html' );
					el.innerHTML = data.content;
					var tagTitle = el.getElementsByTagName('title');
					if (tagTitle[0] != undefined){
						var title = tagTitle[0].text;
					}
					var tagMeta = el.getElementsByTagName('meta');
					if (tagMeta.description != undefined){
                		var description = tagMeta.description.content;
					}
					if (title == null || title == ""){
						$('#title').val('');
						$('#description').val(description);
						$('#title').parent('.form-group').addClass('has-error has-feedback').removeClass('has-success');
						$('#description').parent('.form-group').addClass('has-success').removeClass('has-error has-feedback');
						$("#retrieveAlert").addClass('alert-warning').text('It was impossible to retrieve all info. Please add before submit.').show();
					} else if (description == null || description == "") {
						$('#title').val(title);
						$('#description').val('');
						$('#title').parent('.form-group').addClass('has-success').removeClass('has-error has-feedback');
						$('#description').parent('.form-group').addClass('has-error has-feedback').removeClass('has-success');
						$("#retrieveAlert").addClass('alert-warning').text('It was impossible to retrieve all info. Please add before submit.').show();
					} else {
						$('#title').val(title);
						$('#description').val(description);
						$('#title').parent('.form-group').addClass('has-success').removeClass('has-error has-feedback');
						$('#description').parent('.form-group').addClass('has-success').removeClass('has-error has-feedback');
						$("#retrieveAlert").removeClass('alert-warning').addClass('alert-success').text('Title and Description retrieved. Submit as is or change info.').show();
					}
				}
			}
		});	
	},
	"click .js-clear-form":function(event){
		$('#title').val("").parent('.form-group').removeClass('has-success').removeClass('has-error has-feedback');
		$('#description').val("").parent('.form-group').removeClass('has-success').removeClass('has-error has-feedback');
		$('#url').val("").parent('.form-group').removeClass('has-success').removeClass('has-error has-feedback');
		$("#retrieveAlert").removeClass('alert-warning').removeClass('alert-success').text('').hide();
	},
	"click .close":function(){
		$('.js-clear-form').click();
	}
});

Template.website_item.events({
	"click .js-upvote":function(event){
		upVote(this);
		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){
		downVote(this);
		return false;// prevent the button from reloading the page
	},
	"mouseover .js-upvote":function(event){
		mouseOverUpvote(this);
	},
	"mouseover .js-downvote":function(event){
		mouseOverDownvote(this);
	},
	"click .goToDetails":function(event){
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
	"click .js-save-comment":function(){
		$('#btn-submit').removeClass('hide');
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
		upVote(this);
		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){
		downVote(this);
		return false;// prevent the button from reloading the page
	},
	"mouseover .js-upvote":function(event){
		mouseOverUpvote(this);
	},
	"mouseover .js-downvote":function(event){
		mouseOverDownvote(this);
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

function upVote(object){
	if (Meteor.user()){
		var userId = Meteor.user()._id;
		if ($.inArray(userId, object.upvotes) == -1) {
			Websites.update({_id: object._id}, {$push: {upvotes: userId}});
			Websites.update({_id: object._id}, {$set: {rate: Websites.findOne({_id: object._id}).upvotes.length + 1}});
			Websites.update({_id: object._id}, {$pull: {downvotes: userId}});
		} else {
			Websites.update({_id: object._id}, {$pull: {upvotes: userId}});
			Websites.update({_id: object._id}, {$set: {rate: Websites.findOne({_id: object._id}).upvotes.length - 1}});
		}
		
	} else {
		$('#upvote-'+object._id).popover('toggle');
	}
}

function downVote(object){
	if (Meteor.user()){
		var userId = Meteor.user()._id;
		if ($.inArray(userId, object.downvotes) == -1) {
			Websites.update({_id: object._id}, {$push: {downvotes: userId}});
			Websites.update({_id: object._id}, {$set: {rate: Websites.findOne({_id: object._id}).upvotes.length - 1}});
			Websites.update({_id: object._id}, {$pull: {upvotes: userId}});
		} else {
			Websites.update({_id: object._id}, {$pull: {downvotes: userId}});
			Websites.update({_id: object._id}, {$set: {rate: Websites.findOne({_id: object._id}).upvotes.length + 1}});
		}
	} else {
		$('#downvote-'+object._id).popover('toggle');
	}	
}

function mouseOverUpvote(object){
	if (Meteor.user()){
		var userId = Meteor.user()._id;
		if ($.inArray(userId, object.upvotes) == -1 && $.inArray(userId, object.downvotes) == -1) {
			$('#upvote-'+object._id).attr('title', "Click to give an Up Vote.");
		} else if ($.inArray(userId, object.downvotes) != -1) {
			$('#upvote-'+object._id).attr('title', "You already voted a negative feedback. Click if you want to change your opinion.");
		} else {
			$('#upvote-'+object._id).attr('title', "You already Up voted. Click again to remove your vote.");
		}
	} else {
		$('#upvote-'+object._id).attr('title', "Please login to vote.");
	}	
}

function mouseOverDownvote(object) {
	if (Meteor.user()){
		var userId = Meteor.user()._id;
		if ($.inArray(userId, object.upvotes) == -1 && $.inArray(userId, object.downvotes) == -1) {
			$('#downvote-'+object._id).attr('title', "Click to give an Down Vote.");
		} else if ($.inArray(userId, object.upvotes) != -1) {
			$('#downvote-'+object._id).attr('title', "You already voted a positive feedback. Click if you want to change your opinion.");
		} else {
			$('#downvote-'+object._id).attr('title', "You already Down voted. Click again to remove your vote.");
		}
	} else {
		$('#downvote-'+object._id).attr('title', "Please login to vote.");
	}	
}
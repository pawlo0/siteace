/* global Websites Comments Router*/

Template.website_list.helpers({
	websites:function(){
		var searchValue = Session.get("searchValue");		
		var upvotes, downvotes;
		if(searchValue == "" || searchValue == undefined || searchValue == null){		
			var all = Websites.find().fetch();
		} else {
			var all = Websites.find({$or: [{"title": {$regex : ".*"+searchValue+".*"}},
                             {"url": {$regex : ".*"+searchValue+".*"}},
                             {"description": {$regex : ".*"+searchValue+".*"}}]}).fetch();
		}
		for (var i=0; i < all.length; i++){
			if (all[i].upvotes) {
				upvotes = all[i].upvotes.length;
			} else {
				upvotes = 0;
			}
			if (all[i].downvotes){
				downvotes = all[i].downvotes.length;
			} else {
				downvotes = 0;
			}
			all[i].rate = upvotes;
		}
		all.sort(function(a, b){
  			return a.rate < b.rate;
		});
		
		return all;
	},
	searchOn:function(){
		var searchValue = Session.get("searchValue");
		if(searchValue == "" || searchValue == undefined || searchValue == null){
			return false;
		} else {
			return true;
		}
	}
});

Template.website_item.helpers({
	totalUpvotes:function(){
		if (this.upvotes) {
			return this.upvotes.length;
		} else {
			return 0;
		}
		
	},
	totalDownvotes:function(){
		if (this.downvotes) {
			return this.downvotes.length;
		} else {
			return 0;
		}
	},
	getDate:function(){
		if (this.createdOn) {
			return this.createdOn.toString("d-MMM-yyyy");
		} else {
			return false;
		}
		
	},
	getAuthor:function(createdBy){
		
		if (createdBy) {
			if (Meteor.users.findOne({_id: createdBy})){
				return Meteor.users.findOne({_id: createdBy}).username;
			}
		} else {
			return "Startup";
		}
		
	},
	getLogo:function(url){
		var link = url.split("//")[1].split("/")[0];
		return "http://"+link+"/favicon.ico";
	}	
});


Template.website_details.helpers({
	totalUpvotes:function(){
		if (this.upvotes) {
			return this.upvotes.length;
		} else {
			return 0;
		}
		
	},
	totalDownvotes:function(){
		if (this.downvotes) {
			return this.downvotes.length;
		} else {
			return 0;
		}
	},
	getDate:function(){
		if (this.createdOn) {
			return this.createdOn.toString("d-MMM-yyyy")
		} else {
			return false
		}
		
	},
	getAuthor:function(createdBy){
		if (createdBy) {
			return Meteor.users.findOne({_id: createdBy}).username
		} else {
			return "Startup"
		}
	},
	comments:function(){
		return Comments.find({websiteId: this._id});
	},
	getLogo:function(url){
		var link = url.split("//")[1].split("/")[0];
		return "http://"+link+"/favicon.ico";
	}
});

Template.comments_list.helpers({
	getUser:function(createdBy){
		return Meteor.users.findOne({_id: createdBy}).username
	}
});

Template.navbar.helpers({
	inDetails:function(){
		if (Router.current().route.getName() == 'websites') {
			return true;
		}
	}	
});
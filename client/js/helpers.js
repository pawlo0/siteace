/* global Websites */

Template.website_list.helpers({
	websites:function(){
		var upvotes, downvotes;
		var all = Websites.find().fetch();
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
			all[i].rate = upvotes - downvotes;
		}
		all.sort(function(a, b){
  			return a.rate < b.rate;
		});
		
		return all
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
			return this.createdOn.toString("d-MMM-yyyy")
		} else {
			return false
		}
		
	}
});
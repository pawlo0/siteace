/* global Websites */

Template.website_list.helpers({
	websites:function(){
		return Websites.find({}, {sort: {rating: -1}});
	}
});
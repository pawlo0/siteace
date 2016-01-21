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
		if (Meteor.user()){
			Websites.insert({
		  		title: event.target.title.value, 
		  		url: event.target.url.value, 
		  		description: event.target.description.value, 
		  		createdBy: Meteor.user()._id,
		  		createdOn: new Date()
			});		
		}
		$("#website_form").modal('hide');
		return false;// stop the form submit from reloading the page

	}
});
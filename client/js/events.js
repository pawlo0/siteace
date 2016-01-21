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
/* global Router Websites*/

Router.configure({
    layoutTemplate: 'applicationLayout'
});


Router.route('/', function () {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('welcome', {
        to: "main"
    });
});

Router.route('/websites', function() {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('website_list', {
        to: "main"
    });
});

Router.route('/websites/:_id', function() {
    this.render('navbar2', {
        to: "navbar"
    });
    this.render('website_details', {
        to: "main",
        data: function(){
            return Websites.findOne({_id: this.params._id});
        }
    });
});
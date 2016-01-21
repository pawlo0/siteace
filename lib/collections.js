/* global Websites */
Websites = new Mongo.Collection("websites");

Websites.allow({
    insert: function(userId, doc){
        if (Meteor.user() && userId == doc.createdBy){
            return true;
        } else {
            return false;
        }
    },
    remove: function(){
        if (Meteor.user()){
            return true;
        }
    }
})
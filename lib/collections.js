/* global Websites Comments*/
Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

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
    },
    update: function(){
        if (Meteor.user()){
            return true;
        }
    }
});

Comments.allow({
    insert: function(userId, doc){
        if (Meteor.user() && userId == doc.createdBy){
            return true;
        } else {
            return false;
        }
    },
    remove: function(userId, doc){
        if (userId == doc.createdBy){
            return true;
        } else {
            return false;
        }
    }
});
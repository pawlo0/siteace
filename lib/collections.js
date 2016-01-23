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
    remove: function(userId, doc){
        if (userId == doc.createdBy){
            return true;
        } else {
            return false;
        }
    },
    update: function(userId, doc){
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
        if (userId == doc.createdBy || userId == Websites.findOne({_id: doc.websiteId}).createdBy ){
            return true;
        } else {
            return false;
        }
    }
});
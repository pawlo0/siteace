Meteor.methods({
  "getResponse":function(url){
      return Meteor.http.call("GET",url, {"timeout":5000});
  },
  "checkResponse":function(url){
    var result = Meteor.call("getResponse",url,function (err,result){
    	if (err){
    		console.log(err);
    		return err;
    	} else {
    		console.log("ok");
    		return "ok";
    	}
	console.log(result);
	return result;
    });
}})
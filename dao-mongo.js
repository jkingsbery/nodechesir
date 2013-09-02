var databaseUrl="localhost/nodechesir";
var collections=["followers","messages"];
var db=require("mongojs").connect(databaseUrl,collections);


var users = [
	     { id: 1, username: 'kevin', password: 'secret', email: 'bob@example.com' }
	     , { id: 2, username: 'peter', password: 'birthday', email: 'joe@example.com' }
	     ];

exports.findById=function(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
	fn(null, users[idx]);
    } else {
	fn(new Error('User ' + id + ' does not exist'));
    }
}

exports.findByUsername=function(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
	var user = users[i];
	if (user.username === username) {
	    return fn(null, user);
	}
    }
    return fn(null, null);
}

exports.getConnections=function(user,callback){
    if(user){
    db.followers.findOne({"name":user.username},function(err,followers){
	    if(followers){
		callback(null,followers.follows);		
	    }else{
		callback(null,[]);
	    }

	});
    }
};

exports.getRecentMessages=function(user,callback){
    if(user){
	exports.getConnections(user,function(err,followers){
	    var from=followers;
	    from.push(user.username);
	    db.messages.find({from:{$in:from}},function(err,messages){
		    callback(null,messages);
		});
	    });
    }
}
var databaseUrl="localhost/nodechesir";
var collections=["followers"];
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
    db.followers.findOne({"name":"kevin"},function(err,followers){
	    console.log("FOLLOWERS:");
	    console.log(followers.follows);
	    callback(null,followers.follows);
	});
}

exports.getRecentMessages=function(user){
    return [{
	    from: "peter",
		text:"Reading some XMPP specs",
		date:"2013-08-01"
	},{
	    from: "kevin",
		text:"Too little time",
		date:"2013-08-01"
	},{
	    from: "peter",
		  text: "@kevin Tell me about it",
		  date:"2013-08-02"
	}];
    
}
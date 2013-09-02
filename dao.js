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
    callback(null,["peter"]);
}


exports.getRecentMessages=function(user,callback){
    callback(null,[{
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
	    }]);
    
}
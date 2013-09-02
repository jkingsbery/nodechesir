var express=require("express");
var passport=require("passport");
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
/*
 * TODO: Put this in some kind of data module
 */
var users = [
	     { id: 1, username: 'kevin', password: 'secret', email: 'bob@example.com' }
	     , { id: 2, username: 'peter', password: 'birthday', email: 'joe@example.com' }
	     ];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
	fn(null, users[idx]);
    } else {
	fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
	var user = users[i];
	if (user.username === username) {
	    return fn(null, user);
	}
    }
    return fn(null, null);
}

function getConnections(user){
    return ["peter"];
}

function getRecentMessages(user){
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

var app=express();

app.configure(function(){
	app.set('views',__dirname+'/views');
	app.set('view engine','ejs');
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
    });

app.get('/', function(req, res){
	res.render('index', { user: req.user,connections:getConnections(req.user),messages:getRecentMessages(req.user) });
    });

app.get('/account', ensureAuthenticated, function(req, res){
	res.render('account', { user: req.user });
    });

app.get('/login', function(req, res){
	res.render('login', { user: req.user, message: req.flash('error') });
    });

app.post('/login', 
	 passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	 function(req, res) {
	     res.redirect('/');
	 });

passport.serializeUser(function(user, done) {
	done(null, user.id);
    });

passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
		done(err, user);
	    });
    });

passport.use(new LocalStrategy(
			       function(username, password, done) {
				   // asynchronous verification, for effect...
				   process.nextTick(function () {
      
					   // Find the user by username.  If there is no user with the given
					   // username, or the password is not correct, set the user to `false` to
					   // indicate failure and set a flash message.  Otherwise, return the
					   // authenticated `user`.
					   findByUsername(username, function(err, user) {
						   if (err) { return done(err); }
						   if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
						   if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
						   return done(null, user);
					       })
					       });
			       }
			       ));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

app.listen(8080);
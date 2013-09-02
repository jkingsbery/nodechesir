var express=require("express");
var passport=require("passport");
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var dao=require('./dao-mongo');


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

app.get('/', ensureAuthenticated, function(req, res){
	var result_connections=null;
	var result_messages=null;
	dao.getConnections(req.user,function(error,connections){
		result_connections=connections;
		if(result_messages && result_connections){
		    res.render('index', { 
			user: req.user,
			connections:result_connections,
			messages:result_messages
				});
		}
	    });
	dao.getRecentMessages(req.user,function(error,messages){
		result_messages=messages;
		if(result_messages && result_connections){
		    res.render('index', { 
			user: req.user,
			connections:result_connections,
			messages:result_messages
				});
		}
	    });


		/*	
	dao.getRecentMessages(req.user,function(error,connections){
		result_messages=messages;
		if(result_messages && result_connections){
		    res.render('index', { 
			user: req.user,
			connections:result_connections,
			messages:result_messages
		    });
		}
		});*/
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

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
    });

passport.serializeUser(function(user, done) {
	done(null, user.id);
    });

passport.deserializeUser(function(id, done) {
	dao.findById(id, function (err, user) {
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
					   dao.findByUsername(username, function(err, user) {
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
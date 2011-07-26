
/**
 * Module dependencies.
 */

var express = require('express');

var Database = require(__dirname + "/persistence/db.js");
var db = new Database("theatrikal");
var app = module.exports = express.createServer();
var theatrikal = {app:app, db:db};

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//routes/controllers
require(__dirname + "/controllers/controllers.js")(theatrikal);

db.bootstrap(function(error){
	if (error){
		console.error(error);
		return;
	}
	app.listen(3000);
	console.log("Express server listening on port %d", app.address().port);
});


exports = module.exports = function(application){
	
	application.app.get('/', function(req, res){
		res.render("index",{title:'Welcome to Dramatikal.com'});
	});
	
		
	application.app.get("/productions/add", function(req, res){
		res.render("productions-add", {
				title: "Add Production"
		});
	});
	
	application.app.get('/productions/:id', function(req, res){
		application.db.getProduction(req.params.id, function(error, production){
		 res.render('production', {
		 		title : "Production - " + production.title,
		    production: production
	  	});
		});
	});

	application.app.get('/productions/edit/:id', function(req, res){
		application.db.getProduction(req.params.id, function(error, production){
		 res.render('production-edit', {
		 	title : "Production - " + production.title,
			message : "",
		   	production: production
	  	});
		});
	});

	application.app.post('/productions/edit/:id', function(req, res){
		var title = req.params.title
		application.db.getProduction(req.params.id, function(error, production){
		   	production.title = title
			application.db.saveProduction(production, function(error, production){
				res.render('production-edit', {
				 	title : "Production - " + production.title,
					message: "Updated",
				   	production: production
			  	});
			});
		});
	});
	
	application.app.get("/productions", function(req, res){
			// TODO get paging/ query from request params
			application.db.findProductions({}, {pageSize:10,first:0}, function(error, productions){
				res.render("productions", {
					title: "Productions",
					productions: productions
				});
			});
	});

	
	application.app.post("/productions", function(req, res){
		console.log("Saving production");
		console.log(req.body.production);
		application.db.saveProduction(req.body.production, function(error, production){
			if (error){
				console.log(error);
				return;	
			}
			console.log(production);
			res.redirect("/productions/" + production._id.toHexString());
		});
	});
	
};

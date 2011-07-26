var mongodb = require("mongodb");
var mongoserver = new mongodb.Server("localhost", mongodb.Connection.DEFAULT_PORT);

exports = module.exports = Database;

function Database(name){
	console.log("Database");
	this.db = new mongodb.Db(name, mongoserver);
	// open happens async doing it this way - how do we ensure it is running
	this.db.open(function(error, db){
		if (error){
			console.error(error);
			return;
	}});
}

var app = Database.prototype;

app.bootstrap = function(callback){
	var self = this;
	//check if we have a productions collection	
	self.db.collections(function(error, collections){
		if (error){
			console.error(error);
			callback(error);
			return;
		}
		var i;
		var productions = null;
		for (i=0;i<collections.length;i++){
			var collection = collections[i];
			if (collection.collectionName == "productions"){
				productions = collection;
				break;
			}
		}
		if (productions == null){
			console.info("Creating Productions Collection");
			self.db.createCollection("productions", function(error, collection){
				if (error){
					console.error(error);
					callback(error);
					return;
				}
				collection.insert({"title":"Romeo & Juliet", "cast":[{"role":"Romeo",
 				"actor":"Joe Blogs"}, {"role":"Juliet", "actor":"Jane Bloggs"}]});
			});
		}
		callback(null);
	});
};

app.getProductionsCollection = function(callback){
	var self = this;
	if (self.productions != null){
		callback(null, self.productions);
		return;
	}
	this.db.collection("productions", function(error, result){
		if (error){
			console.error(error);
			callback(error, null);
		}
		else {
			self.productions = result;
			callback(null, result);
		}
	});
};

app.getProduction = function(id, callback){
	var productionId = this.db.bson_serializer.ObjectID.createFromHexString(id);
	this.getProductionsCollection(function(error, collection){
		if (error){
			callback(error, null);
			return;
		}
		
		collection.findOne({_id:productionId}, function(error, production){
			if (error){
				console.error(error);
				callback(error, null);
				return;
			}
			else {
				callback(null, production);
			}
		});
	});
}

app.findProductions = function(query, options, callback){
	this.getProductionsCollection(function(error, collection){
		if (error){
			callback(error, null);
			return;
		}
		collection.find(query).toArray(function(error, result){
			if (error){
				console.error(error);
				callback(error, result);
			}
			else {
				callback(null, result);
			}
		});
	});
};

app.saveProduction = function(production, callback){
	this.getProductionsCollection(function(error, collection){
		if (error){
			callback(error, null);
			return;
		}
		collection.insert(production, {safe:true}, function(error, records){
			if (error){
				callback(error, null);
			}
			else {
				callback(null, records[0]);
			}
		});
	});
}

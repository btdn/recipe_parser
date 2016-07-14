var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
  'user': 'root',
  'password': 'root',
  'host': 'localhost',
  'database': 'mysql',
});

//Establishing mysql connection
con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

/* GET users listing. */
exports.recipes = function (req, res) {
  //Drawing information from the database for later parsing
//FOR LATER: con.query should be inside other calls 
	recipes = {}
	con.query('SELECT * FROM recipes LIMIT 10',function(err,rows){
  		if(err) throw err;
  		console.log('Data received from Db:\n');
  		for (i = 0; i < rows.length; i++) {
    		row = rows[i];
	    	console.log(row.recipe_name)
	    	recipes[row.recipe_name] = {}
	    	console.log('SELECT * FROM ingredients WHERE recipe_id=' + row.id);
	    	con.query('SELECT * FROM ingredients WHERE recipe_id=' + row.id ,function(errI,rowsI){
	      		if(errI) throw errI;
	      		if (rowsI.length == 0) return;
	      		recipes[row.recipe_name]['ingredients'] = rowsI
	      		recipes[row.recipe_name]['actions'] = []
	      		con.query('SELECT * FROM steps WHERE recipe_id=' + rowsI[0].recipe_id, function(errS,rowsS) 	{
	        		if(errS) throw errS;
	        		for (i = 0; i < rowsS.length; i++) {
	          			rowS = rowsS[i]
	          			con.query('SELECT * FROM node WHERE step_id="' + rowS.id + '"', function(errN,rowsN){
	            			recipes[row.recipe_name]['actions'].push(rowsN)
	            			console.log(recipes)
	          			});
	    			}
	    		});
	    	});
  		}
	});
	res.send('respond with a resource');
};

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/recipes', function(req, res, next) {
  //Drawing information from the database for later parsing
//FOR LATER: con.query should be inside other calls 
	con.query('SELECT * FROM recipes',function(err,rows){
  		if(err) throw err;
  		console.log('Data received from Db:\n');
  		for (i = 0; i < rows.length; i++) {
    		row = rows[i];
	    	console.log(row.recipe_name)
	    	console.log('SELECT * FROM ingredients WHERE recipe_id=' + row.id);
	    	con.query('SELECT * FROM ingredients WHERE recipe_id=' + row.id ,function(errI,rowsI){
	      		if(errI) throw errI;
	      		console.log('Data received from Db:\n');
	      		if (rowsI.length == 0) return;
	      		con.query('SELECT * FROM steps WHERE recipe_id=' + rowsI[0].recipe_id, function(errS,rowsS) 	{
	        		if(errS) throw errS;
	        		console.log("GETTING IN HERE");
	        		console.log(rowsS);
	        		for (i = 0; i < rowsS.length; i++) {
	          			rowS = rowsS[i]
	          			con.query('SELECT * FROM node WHERE step_id="' + rowS.id + '"', function(errN,rowsN){
	            			console.log(rowsN)
	          			});
	    			}
	    		});
	    	});
  		}
	});
	res.send('respond with a resource');
});

module.exports = router;

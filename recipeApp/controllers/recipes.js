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


function findAssocIngr(ingredients, matchIngredient) {
	console.log("match ingredient: " + matchIngredient)
	for(i = 0; i<ingredients.length;i++) {
		console.log('this ingredient: '+ingredients[i].name)
		if(ingredients[i].name === matchIngredient) {
			return i
		}
	}
	return -1
}

function getNewInstruction(recipe, ingredients) {
	var newInstructions = []
	for(i=0; i < recipe.length; i++) {
		var steps = recipe[i][1]
		console.log(steps.length)
		console.log(steps)
		for(j=0; j < steps.length; j++) {
			console.log(steps[j].class)
			if(steps[j].class == "action") {
				console.log(newInstructions)
				newInstructions.push({'text': recipe[i][0], 'associatedIngr':[], 'keyword': steps[j].text});
			} else {
				newInstructions[newInstructions.length-1]['associatedIngr'].push(findAssocIngr(ingredients, steps[j].text))
			}
		}
	}
	
	return newInstructions
}


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
	    	con.query('SELECT * FROM ingredients WHERE recipe_id=' + row.id ,function(errI,rowsI) {
	      		if(errI) throw errI;
	      		if (rowsI.length == 0) return;
	      		for (i=0;i<rowsI.length;i++) {
	      			console.log(rowsI[i])
	      		}
	      		recipes[row.recipe_name]['ingredients'] = rowsI
	      		recipes[row.recipe_name]['actions'] = []
	      		con.query('SELECT * FROM steps WHERE recipe_id=' + rowsI[0].recipe_id, function(errS,rowsS) 	{
	        		if(errS) throw errS;
	        		//put this into an ingredient array
	        		function recursiveSteps(i) {
	        		//	for (i = 0; i < rowsS.length; i++) {
	        			if (i == rowsS.length) {
	        				var newIngredient = []
	        				var newInstruction = []
	        				for(j=0;j<rowsI.length;j++) {
	        					ingredient = rowsI[j]
	        					newIngredient.push({'name':ingredient.text_name, 'amount': 1, 'metric': 'cup'});
	        				}
	        				console.log(newIngredient)
	        				newInstruction = getNewInstruction(recipes[row.recipe_name]['actions'], newIngredient)
	        				//console.log(recipes);
	        			} else {	        			
	          				rowS = rowsS[i]
	          				con.query('SELECT * FROM node WHERE step_id="' + rowS.id + '"', function(errN,rowsN){
	            				recipes[row.recipe_name]['actions'].push([rowS.text_line, rowsN])
	           					console.log("INGREDIENTS: " + rowsI);
	           					rowsN.sort(function(a, b) {
	           						return a.rank - b.rank;
	           					});
	           					recursiveSteps(i + 1)
	          				});
	          			}
	    			//	}
	        		}
	        		recursiveSteps(0)
	        		
	    		});
	    	});
  		}
	});
	res.send('respond with a resource');
};

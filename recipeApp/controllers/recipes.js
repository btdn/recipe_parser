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
	for(i = 0; i<ingredients.length;i++) {
		if(ingredients[i].name === matchIngredient) {
			return i
		}
	}
	return -1;
}

function getNewInstruction(recipe, ingredients) {
	var newInstructions = []
	for(i=0; i < recipe.length; i++) {
		var steps = recipe[i][1]
		for(j=0; j < steps.length; j++) {
			if(steps[j].class == "action") {
				newInstructions.push({'text': recipe[i][0], 'associatedIngr':[], 'keyword': steps[j].text});
			} else {
				if (newInstructions.length > 0) {
					newInstructions[newInstructions.length-1]['associatedIngr'].push(findAssocIngr(ingredients, steps[j].text))
				} else {
					newInstructions.push({'text': recipe[i][0], 'associatedIngr':[steps[j].text], 'keyword': 'no-action'});
				}
				
			}
		}
	}
	return newInstructions
}

function getInstruction(recipe) {
	var instruction = [];
	for (var key in recipe) {
  		if (recipe.hasOwnProperty(key)) {
    		var nodes = recipe[key]['nodes'];
    		console.log(key);
    		if(nodes == undefined) continue;
    		var text_line = recipe[key]['text_line'];
    		var lastInsert = -1;
    		for(var j = 0; j < nodes.length; j++) {
    			var node = nodes[j];
    			if(node.class === 'action') {
    				instruction.push({'text': text_line, 'keyword': node.text, 'associatedIngr': []});
    				var lastInsert = instruction.length-1;
    			} else {
    				if (lastInsert != -1) {
    					instruction[lastInsert]['associatedIngr'].push(node.text);
    				} else {
    					var lastInsert = 0;
    					instruction.push({'text': text_line, 'keyword': node.text, 'associatedIngr': [node.text]});
    				}
    			}
    		}
  		}
	}
	console.log("FINAL INSTRUCTIOn");
	console.log(instruction);
}

/* GET users listing. */
exports.recipes = function (req, res) {
  //Drawing information from the database for later parsing
//FOR LATER: con.query should be inside other calls 
	recipes = {}
	con.query('SELECT * FROM recipes LIMIT 10',function(err,rows){
  		if(err) throw err;
  		for (i = 0; i < rows.length; i++) {
    		row = rows[i];
	    	recipes[row.id] = {}
	    	con.query('SELECT * FROM ingredients WHERE recipe_id=' + row.id ,function(errI,rowsI) {
	      		if(errI) throw errI;
	      		if (rowsI.length == 0) return;
	      		var recipe_id = rowsI[0].recipe_id
	      		recipes[recipe_id]['ingredients'] = rowsI
	      		//recipes[recipe_id]['actions'] = []
	      		recipes[recipe_id]['text'] = ""
	      		con.query('SELECT * FROM steps WHERE recipe_id=' + rowsI[0].recipe_id, function(errS,rowsS) 	{
	        		if(errS) throw errS;
	        		if (rowsS.length == 0) return;
	        		var recipe_id = rowsS[0].recipe_id;
	        		console.log("RECIPE: " + recipe_id)
	        		console.log("STEPS: " + rowsS)
	        		//put this into an ingredient array
	        		function recursiveSteps(i, recipe_id, step_id, rowsS) {
	        		//	for (i = 0; i < rowsS.length; i++) {
	        			if (i < 0) {
	        				console.log(i)
	        				console.log("INGREDIENTS: " );
	        				var newIngredient = []
	        				var newInstruction = []
	        				for(j=0;j<recipes[recipe_id]['ingredients'].length;j++) {
	        					ingredient = recipes[recipe_id]['ingredients'][j]
	        					console.log(ingredient)
	        					newIngredient.push({'name':ingredient.text_name, 'amount': 1, 'metric': 'cup'});
	        				}
	        				getInstruction(recipes[recipe_id]);
	        			//	newInstruction = getNewInstruction(recipes[recipe_id][step_id], newIngredient)
	        			//	console.log(newInstruction) 
	        				return;
	        				//console.log(recipes); */
	        			} else {	        			
	          				rowS = rowsS[i]
	          				console.log("We're on step " + i + " recipe_id " + recipe_id + "whose text is " + rowS.text_line)
	          				recipes[recipe_id][rowS.id] = {}
	          		//		console.log("Recursion at level: " + i + " with recipe_id " + recipe_id)
	          				recipes[recipe_id][rowS.id]['text_line'] = rowS.text_line;
	          				con.query('SELECT * FROM node WHERE step_id="' + rowS.id + '"', function(errN,rowsN){
	           					if(rowsN.length > 0)  {
		           					rowsN.sort(function(a, b) {
		           						return a.rank - b.rank;
		           					});
		           					var step_id = rowsN[0].step_id
		           					console.log("NODES of step_id "+step_id+": " + rowsN); 
		           					recipes[recipe_id][step_id]['nodes'] = rowsN;
	           					}
	           					recursiveSteps(i - 1, recipe_id, step_id, rowsS);
	          				}); 
	          			}
	    			//	}
	        		}
	        		recursiveSteps(rowsS.length-1, recipe_id, -1, rowsS); 

	    		}); 
	    	});
  		}
	});
	res.send('respond with a resource');
};

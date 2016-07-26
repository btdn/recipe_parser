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

var recipe_data = {'percent_complete': 0.0, 'data': []};
var num_recipes = 0;

function findAssocIngr(ingredients, matchIngredient, usedIngredients) {
	var finalResults = [];
	for(i = 0; i<ingredients.length;i++) {
		var matchKeys = matchIngredient.split(" ");
		var currKeys = ingredients[i].name.split(" ");
		for(j=0;j<matchKeys.length;j++) {
			for(k=0;k<currKeys.length;k++) {
				if(matchKeys[j] === currKeys[k]) {
					finalResults.push(i);
				}
			}
		}
	}
	return finalResults;
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
					newInstructions[newInstructions.length-1]['associatedIngr'].push(findAssocIngr(ingredients, steps[j].text));
				} else {
					newInstructions.push({'text': recipe[i][0], 'associatedIngr':[steps[j].text], 'keyword': 'no-action'});
				}		
			}
		}
	}
	return newInstructions
}

function getInstruction(recipe, ingredients) {
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
    				if(instruction.length > 1) {
    					(instruction[instruction.length-1]['associatedIngr']).push(ingredients.length+1);
    				}
    			} else {
    				if (lastInsert != -1) {
    					instruction[lastInsert]['associatedIngr'] = instruction[lastInsert]['associatedIngr'].concat(findAssocIngr(ingredients, node.text));
    					console.log("HELLMAN's");
    					console.log(instruction[lastInsert]['associatedIngr']);
    				} else {
    					var lastInsert = 0;
    					instruction.push({'text': text_line, 'keyword': node.text, 'associatedIngr': findAssocIngr(ingredients, node.text)});
    					if(instruction.length > 1) {
    						instruction[instruction.length-1]['associatedIngr'].push(ingredients.length+1);
    					}	
    				}
    			}
    		}
  		}
	}
	return instruction;
}

exports.get_recipes = function (req, res) {
	recipe_data['percent_complete'] = recipe_data['data'].length/num_recipes;
	console.log(recipe_data);
	res.send(JSON.stringify(recipe_data)); 
}

/* GET users listing. */
exports.recipes = function (req, res) {
  //Drawing information from the database for later parsing
	recipes = {}
	con.query('SELECT * FROM recipes where type="cookie" LIMIT 10',function(err,rows){
  		if(err) throw err;
  		for (i = 0; i < rows.length; i++) {
    		row = rows[i];
    		num_recipes = rows.length;
	    	recipes[row.id] = {}
	    	con.query('SELECT * FROM ingredients WHERE recipe_id=' + row.id ,function(errI,rowsI) {
	      		if(errI) throw errI;
	      		if (rowsI.length == 0) return;
	      		var recipe_id = rowsI[0].recipe_id
	      		recipes[recipe_id]['ingredients'] = rowsI
	      		recipes[recipe_id]['text'] = ""
	      		con.query('SELECT * FROM steps WHERE recipe_id=' + rowsI[0].recipe_id, function(errS,rowsS) 	{
	        		if(errS) throw errS;
	        		if (rowsS.length == 0) return;
	        		var recipe_id = rowsS[0].recipe_id;
	        		console.log("RECIPE: " + recipe_id)
	        		console.log("STEPS: " + rowsS)
	        		//put this into an ingredient array
	        		function recursiveSteps(i, recipe_id, step_id, rowsS) {
	        			if (i < 0) {
	        				var newIngredient = []
	        				var newInstruction = []
	        				for(j=0;j<recipes[recipe_id]['ingredients'].length;j++) {
	        					ingredient = recipes[recipe_id]['ingredients'][j]
	        					console.log(ingredient)
	        					newIngredient.push({'name':ingredient.text_name, 'amount': 1, 'metric': 'cup'});
	        				}
	        				var newInstruction = getInstruction(recipes[recipe_id], newIngredient);
	        				recipe_data['data'].push([newInstruction, newIngredient]);
	        			} else {	        			
	          				rowS = rowsS[i]
	          				console.log("We're on step " + i + " recipe_id " + recipe_id + "whose text is " + rowS.text_line)
	          				recipes[recipe_id][rowS.id] = {}
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
	           					var newInstruction = recursiveSteps(i - 1, recipe_id, step_id, rowsS);
	           					return newInstruction;
	          				}); 
	          			}
	        		}
	        		console.log(recursiveSteps(rowsS.length-1, recipe_id, -1, rowsS) ); 

	    		}); 
	    	});
  		}
	});
	res.send("STARTED IT UP YO");
};

 function isUppercase(word) {
    return (word === word.toUpperCase()); 
 }

var currGraph = JSON.parse(window.sessionStorage.getItem('currSearch'));
var states = currGraph[0][0];

var dummyData = [];
var includeArr = [];
var excludeArr = [];
var counter = 0;

for(var state in states) {
	console.log(state);
	if(isUppercase(state)) {
		dummyData.push({name: state, type: 'action', id: counter})
	} else {
		dummyData.push({name: state, type: 'ingredient', id: counter})
	}
	counter += 1;
}

var dummyRecipes = ['blueberry muffins', 'chocolate chip cookies', 'peanut butter cookies', 'sugar cookies', 'BLT sandwich', 'blueberry pancakes', 'falafel wrap', 'Sunday Pot Roast', 'potato latkes']


function switchValue(event) {
	$("#dropdown").html($(event.target).text() + ' ' + '<span class="caret"></span>');
	$("#dropdown").removeClass("btnNO");
	$("#dropdown").removeClass("btnYES");
	if($(event.target).text() === "NO") {
		$("#dropdown").addClass("btnNO");
	} else {
		$("#dropdown").addClass("btnYES");
	}
}

var $recipeSearchBar =  $("#recipeSearchBar");
$recipeSearchBar.keyup(function(event) {
	$("#recipeSearchContents").empty();
	var value = $recipeSearchBar.val();
	console.log($recipeSearchBar.val())
	if(value.length > 0) {
		for(i=0; i < dummyRecipes.length; i++) {
			if (dummyRecipes[i].indexOf(value) != -1) {
				//add the object to your list
				$("#recipeSearchContents").append("<li class='recipeList' id='recipe"+i+"'>"+dummyRecipes[i]+"</li>");
				$("#recipe"+i).click(function(event) {
					var text = $(this).text();
					$("#recipeSearchContents").empty();
					$("#recipeSearchContents").append("<li class='recipeList'>"+text+"</li>");
				});
			}
		}

	}
	
});

var $searchBar =  $(".searchBar");
$searchBar.keyup(function(event) {
	var value = $searchBar.val();
	$("#searchContents").empty();
	console.log(value);
	if(value.length > 0) {
		for(i=0; i < dummyData.length; i++) {
			if (dummyData[i]['name'].indexOf(value) != -1) {
				//add the object to your list

				$("#searchContents").append("<li id="+dummyData[i]['id']+">"+dummyData[i]['name']+"</li>");
				var toggleValue = $("#dropdown").text();
				if (dummyData[i]['type'] === 'ingredient') {
					$("#"+dummyData[i]['id']).addClass("ingredient"+toggleValue);
				} else {
					$("#"+dummyData[i]['id']).addClass("action"+toggleValue);
				}
				$("#"+dummyData[i]['id']).click(function(event) {
					var classes = $(this).attr("class").split(' ');
					var contentStyling = classes[1];
					var borderStyling = classes[0];
					console.log($(this).text());
					if(contentStyling.indexOf('YES') != -1) {
						includeArr.push($(this).text());
					} else {
						excludeArr.push($(this).text());
					} 
					$('#col'+ borderStyling).append("<li class='"+ contentStyling + " " + borderStyling + "' id='input"+ $(this).attr('id')+"'>"+$(this).text()+"</li>");
					$(this).remove();
				});
				$("#"+dummyData[i]['id']).hover(function() {
					var classes = $(this).attr("class").split(' ');
					var borderStyling = classes[0];
					console.log('onclick'+ borderStyling);
					$(this).toggleClass('onclick'+ borderStyling);
				});		
			}
		}

	}

});

function findRecipe(keyword, currGraph) {
	var indexes = [];
	for(var i = 0; i < currGraph.length; i++) {
		var recipe = currGraph[i];
		var states = recipe[0];
		if(states[keyword]) {
			indexes.push(i);
		}
	}
	return indexes
}

function findCommonRecipes(incudeArr, excludeArr, currGraph) {
	var indexesEx = {};
	var indexes = [];
	for(var i = 0; i < excludeArr.length; i++) {
		var newIndex = findRecipe(excludeArr[i], currGraph);
		for(var j = 0; j < newIndex.length; j++) {
			indexesEx[newIndex[j]] = 1;
		}
	//	indexesEx[findRecipe(excludeArr[i], currGraph)] = 1;
	}
	console.log(indexesEx);
	for(var i = 0; i < includeArr.length; i++) {
		var newIndex = findRecipe(includeArr[i], currGraph);
		for(var j = 0; j < newIndex.length; j++) {
			console.log(newIndex[j]);
			console.log(indexesEx[newIndex[j]]);
			if (!indexesEx[newIndex[j]]) {
				indexes.push(newIndex[j]);
			}
		}
	//	if (!indexesEx[newIndex]) {
	//		indexes = indexes.concat(findRecipe(includeArr[i], currGraph));
	//	}	
	}
	console.log(indexes);
	return indexes;
}

$("#searchBtn").click(function(event) {
	var finalResults = JSON.parse(window.sessionStorage.getItem('finalResults'));
	var commonIndexes = findCommonRecipes(includeArr, excludeArr, currGraph);
	console.log(commonIndexes);
	if(commonIndexes.length > 0) {
		window.sessionStorage.setItem('commonIndexes', JSON.stringify(commonIndexes) );
		window.sessionStorage.setItem('include', JSON.stringify(includeArr) );
		window.sessionStorage.setItem('exclude', JSON.stringify(excludeArr) );
	}
//	window.location.href = "/";
	//CircleRenderer.render(commonIndexes)
	//				recipeChartView.render(finalResults);
	/*				for(var i = 0; i < commonIndexes.length; i++) {
						if(finalResults[i].marker)
						GraphRenderer.render(commonIndexes[i]);
						if(!finalResults[commonIndexes[i]].marker) {
							finalResults[commonIndexes[i]].marker = {fillColor: 'purple'};	
						}
					}*/
	
	//				recipeChartView.render(finalResults); 

});


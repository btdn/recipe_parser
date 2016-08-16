var dummyData = [
	{ name: 'apple',
	type: 'ingredient',
	id: 0,
	},
	{ name: 'milk',
	type: 'ingredient',
	id: 1,
	},
	{ name: 'flour',
	type: 'ingredient',
	id: 2,
	},
	{ name: 'eggs',
	type: 'ingredient',
	id: 3,
	},
	{ name: 'salt',
	type: 'ingredient',
	id: 4,
	},
	{ name: 'pepper',
	type: 'ingredient',
	id: 5,
	},
	{ name: 'stir',
	type: 'action',
	id: 6,
	},
	{ name: 'bake',
	type: 'action',
	id: 7,
	},
	{ name: 'boil',
	type: 'action',
	id: 8,
	},
	{ name: 'fry',
	type: 'action',
	id: 9,
	},
	{ name: 'broil',
	type: 'action',
	id: 10,
	},
];

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
	console.log("AWESOME");
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


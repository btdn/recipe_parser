(function() {

	var NodeSelection = {};

	function findCommonRecipes(keyword, currGraph) {
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

	NodeSelection.select = function() {
			$(".selection").click(function() {

					var keyword = $(this).find("text").find("tspan").text();
					var currGraph = JSON.parse(window.sessionStorage.getItem('currSearch'));
					var finalResults = JSON.parse(window.sessionStorage.getItem('finalResults'));
					var commonIndexes = findCommonRecipes(keyword, currGraph);
					CircleRenderer.render(commonIndexes)
					recipeChartView.render(finalResults);
					for(var i = 0; i < commonIndexes.length; i++) {
			//			if(finalResults[i].marker)
			//			GraphRenderer.render(commonIndexes[i]);
						if(!finalResults[commonIndexes[i]].marker) {
							finalResults[commonIndexes[i]].marker = {fillColor: 'purple'};	
						}
					}
					recipeChartView.render(finalResults);
			});
	}

	window.NodeSelection = NodeSelection;

})();


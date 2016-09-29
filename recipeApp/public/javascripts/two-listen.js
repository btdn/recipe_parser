(function() {
	var AddListeners = {};
	var indexes = [];

	function modal(index1, index2) {
		var currGraph = window.sessionStorage.getItem('currSearch');
		currGraph = JSON.parse(currGraph);
		var modalTemplate = Handlebars.compile($("#modal_template").html());
		console.log(currGraph);
		var title1 = currGraph[index1][3];
		var title2 = currGraph[index2][3];
		$("#portfolioModal1").html(modalTemplate({title1: title1, title2: title2}));
		$(".portfolio-link").trigger('click');
	//	UpgradeListener.listen(index1);	
	}

	function createTextBlocks(indexes, currGraph) {
		var index1 = indexes[0];
		var index2 = indexes[1];
		var instructionsA = currGraph[index1][7];
		var instructionsB = currGraph[index2][7];
		// var longer;
		// var shorter;
		// if(instructionsA.length > instructionsB.length) {
		// 	longer = instructionsA;
		// 	shorter = instructionsB;
		// } else {
		// 	shorter = instructionsA;
		// 	longer = instructionsB;			
		// }
	//	var difference = longer.length - shorter.length;
		var lastIndex = 0;
		var lastlastIndex = 0;
		var finalResult = [];
		var intermediate = [];
		for(var i = 0; i < instructionsA.length; i++) {
		//	var curr = longer[i];
			var curr = instructionsA[i];
			var found = false;
			for(var j = lastIndex; j < instructionsB.length; j++) {
			//	console.log(curr);
		//		console.log(shorter[j]);
			//	if(curr === instructionsB[j]) {
				if(curr === instructionsB[j]) {
					intermediate.push([i, j]);
					var startingPoint = j;
					found = true;
					lastIndex = j;
					lastLastIndex = lastIndex;

				}
			//		finalResult.push(instructionsB[j]);

			//	} 
			}
			
		}
		return intermediate;


	}

	AddListeners.recieve = function(index1, index2) {
		modal(index1, index2);
		var currGraph = window.sessionStorage.getItem('currSearch');
	    currGraph = JSON.parse(currGraph);
		var similarities = createTextBlocks([index1, index2], currGraph);
		TwoCompare.render(index1, index2, similarities);
	}

	AddListeners.listenNow = function() { $(".clickPanel").click(function() {
			var numberPattern = /\d+/g;
			var id = this.id.match(numberPattern);
			var id = id[0];
			var currGraph = window.sessionStorage.getItem('currSearch');
			currGraph = JSON.parse(currGraph);
			if(indexes.length == 1) {
				console.log("Getting in Here");
				if(id === indexes[0]) {
					return;
				}
			}
			console.log(indexes);
			console.log(id);
			indexes.push(id);

			if(indexes.length == 2) {
				console.log("AMAZING");
				modal(indexes[0], indexes[1]);
			//	UpgradeListener.initialize(indexes[0]);
				var similarities = createTextBlocks(indexes, currGraph);
				console.log(similarities)
				TwoCompare.render(indexes[0], indexes[1], similarities);
				indexes = [];
			}
			
	//		$( "#downgrade" ).trigger( "click" );
			
		});
	};

	window.AddListeners = AddListeners;
})();
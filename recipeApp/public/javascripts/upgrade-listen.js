(function() {
	var UpgradeListener = {};

	var currIndex = -1;

	UpgradeListener.initialize = function(index) {
		var currGraph = window.sessionStorage.getItem('currSearch');
		currGraph = JSON.parse(currGraph);
		console.log("GETTING IN HERE");
		var top6 = currGraph[index][6];
		if(currIndex == -1) {
			for(var i = 0; i < top6.length; i++) {
				if(top6[i][1] == index) {
					currIndex = i;
				}
			}	
		}
		$('#thisLevel').text(currIndex);
		console.log("UPGRADE");
		console.log(top6);
		console.log(currIndex);
		GraphRenderer.render(top6[currIndex][1], null, null, "#graphA");
	}


	UpgradeListener.listen = function(index) { $("#upgrade").click(function() {
			var currGraph = window.sessionStorage.getItem('currSearch');
			currGraph = JSON.parse(currGraph);
			console.log("GETTING IN HERE");
			var top6 = currGraph[index][6];
			if(currIndex == -1) {
				for(var i = 0; i < top6.length; i++) {
					if(top6[i][1] == index) {
						currIndex = i;
					}
				}	
			}
			console.log("UPGRADE");
			console.log(top6);
			console.log(currIndex);
			$('#thisLevel').text(currIndex);
			GraphRenderer.render(top6[currIndex][1], null, null, "#graphA");
			currIndex += 1;
			if(currIndex == 6) {
				currIndex = 5;
			}

		});

		$("#downgrade").click(function() {
			var currGraph = window.sessionStorage.getItem('currSearch');
			currGraph = JSON.parse(currGraph);
			var top6 = currGraph[index][6];
			if(currIndex == -1) {
				for(var i = 0; i < top6.length; i++) {
					if(top6[i][1] == index) {
						currIndex = i;
					}
				}	
			}
			console.log("DOWNGRADE");
			console.log(top6);
		///		console.log(top6[currIndex]);
			console.log(currIndex);
			console.log(top6[currIndex][1])
			
			GraphRenderer.render(top6[currIndex][1], null, null, "#graphA");
			currIndex -= 1;
			if(currIndex == -1) {
				currIndex = 0;
			}
		});
	};

		

	window.UpgradeListener = UpgradeListener;
})();
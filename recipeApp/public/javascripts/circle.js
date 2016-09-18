(function() {
	CircleRenderer = {};
	CircleRenderer.render = function (indexArray) {
		console.log(indexArray);
		var currGraph = window.sessionStorage.getItem('currSearch');
		currGraph = JSON.parse(currGraph);
		currGraph = currGraph.slice(0, 20);
		var example = [];
		var ingredientCircles = [];
		if(indexArray) {
			for(var i = 0; i < indexArray.length; i++) {
				if(indexArray[i] >= currGraph.length) break;
				example.push([currGraph[indexArray[i]][7], currGraph[indexArray[i]][3], currGraph[indexArray[i]][4], currGraph[indexArray[i]][5], currGraph[indexArray[i]][2]]);
			}
		} else {
			for(var i = 0; i < currGraph.length; i++) {
				example.push([currGraph[i][7], currGraph[i][3], currGraph[i][4], currGraph[i][5], currGraph[i][2]]);
			}
		}

	 var nodeDict = {};

	 xCounter = 40;

	 yCounter = 15;

	 var jsonCircles = [];

	 var usedBefore = {};

	var example = example.sort(function(a,b) {return a[0].length - b[0].length});
	console.log(example);

	var recipeNames = [];
	var ingrCircles = [];
	var counter = 0;
	for(var i = 0; i < example.length; i++) {
		var instance = example[i][0];
		var justText = example[i][2];
		var textIndexes = example[i][3];
		for(var j = 0; j < instance.length; j++) {
			var circle = {ingredient: false, description: justText[textIndexes[instance[j]]], name: "node"+i, "group": counter, x: xCounter, y: yCounter, r: 15, label: instance[j]};
			
			var subXCounter = 5;
			if (example[i][4][instance[j]]) {
				for(var k = 0; k < example[i][4][instance[j]].length; k++) {
					console.log(instance[j]);
					var ingrCircle = {ingredient: true, name: "ingrNode"+i, "group": counter, x: xCounter + subXCounter, y: yCounter, r: 15, label: example[i][4][instance[j]][k]};
					jsonCircles.push(ingrCircle)
				//	subXCounter -= 5
					console.log(example[i][4][instance[j]][k]);
				}
			}
			jsonCircles.push(circle);
			recipeNames.push(example[i][1]);
			console.log(textIndexes);
			counter += 1;
			yCounter += 25;	
		}
		yCounter = 15;
		xCounter += 40;
	}
//	jsonCircles = jsonCircles.slice(0, 300);

	  var width = 960,
	  height = 500;

	 var json = {"nodes":jsonCircles};



$("#canvas").html("")
var svg = d3.select("#canvas")
var container  = svg.append("g")
 

	    /* Define the data for the circles */
	    var elem = container.selectAll("g")
	        .data(json.nodes)


	            var lines = container.attr("class", "line")
	                .selectAll("line").data(json.nodes)
	              //  .selectAll("line").data(json.nodes)
	                .enter()

	            for(var i = 0; i < json.nodes.length; i++) {
	            	var y = json.nodes[i];
	            	var dLabel = null
	            	var line = lines.append("line")
	            	.attr("x1", function (d, i) {
	                	return d.x
	            	})
	            	.attr("y1", function (d) {
	                	return d.y
	            	})
	            	.attr("x2", function (d) {
	                	return y.x
	            	})
	            	.attr("y2", function (d) {
	            		
	                	return y.y
	            	})
	            	.attr("class", function(d) {

	            		if(d.label === y.label) {
	            			nodeDict[y.label] = "." + d.label + y.label
	            			usedBefore[d.group] = ""
	            			return d.label + y.label;
	            		} else {

	            			return ""
	            		}
	            		
	            	})

	            }

	    /*Create and place the "blocks" containing the circle and the text */
	 //   var container = svg.append("g")  
	    var elemEnter = elem.enter()
	        .append("g")
	        .attr("transform", function(d){return "translate("+d.x+","+d.y+")"})

	    var styleTooltip = function(name, description) {
	      return "<p class='name'>" + name + "</p><p class='description'>" + description + "</p>";
	    };

	    /*Create the circle for each block */
	    var circle = elemEnter.append("circle")
	        .attr("r", function(d){return d.r} )
	        .attr("stroke","black")
	        .attr("fill", function(d) { if(d.ingredient) { return "#C0D9AF" } else { return "white"}})
	        .attr("title", function(v) { if(!v.ingredient) {return styleTooltip(v.label, v.description)} })
	        .attr("class", function(d) { if(!d.ingredient) {return d.label + " " + d.name } })
	        .each(function(v) { if(!v.ingredient) {$(this).tipsy({ gravity: "w", opacity: 1, html: true }); } })

	    /* Create the text for each block */
	    elemEnter.append("text")
	        .attr("dx", function(d){return -13})
	        .attr("dy", function(d){return 4})
	        .style("font-size","6pt")
	        .style("font-family","Avenir")
	        .text(function(d){ return d.label })
	        

	    circle
	    	.on("mouseover", function(d) { 
	    		$("#sequenceVis").text(recipeNames[d.group]);
	    		var nodeClass = nodeDict[d.label];
	    		var selection = $(nodeClass);
	    		selection.css("stroke", "gray");
	    		$("."+d.name).css("fill", "gray");
	    		$("."+d.label).css("fill", "#ADD8E6");

	    		
	    	})
	    	.on("mouseout", function(d) {
	    		var nodeClass = nodeDict[d.label];
	    		var selection = $(nodeClass);
	    		selection.css("stroke", "");
	    		$("."+d.label).css("fill", "white");
	    		$("."+d.name).css("fill", "white");

	    	});

	    		     svg.call(d3.behavior.zoom()
   //     .x(x)
   //     .y(y)
        .scaleExtent([1,3])
        .on("zoom", zoom))

	//   container.append(elemEnter)
  function zoom() {
  	container.attr("transform", "translate(" + d3.event.translate + ")" +
	            "scale(" + d3.event.scale + ")")
//  	.attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
  }
 


	}

	window.CircleRenderer = CircleRenderer;
})();
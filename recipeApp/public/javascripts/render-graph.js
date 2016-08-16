(function(){
	var GraphRenderer = {};

	var colorGradient = ["#CC8866", "#E08152", "#F57A3D", "#FF5500"];
	var colorGradientS = ['#B8D3E0', '#94BDD1', '#70A7C2', '#4D90B2'];
	var ingrFreq = null;
	var instrFreq = null;
	var graphIndex = true;
	var inners = [];

	function calculateHex(keyword, ingrFlag, ingr, instr) {
		if(ingr) {
			ingrFreq = ingr;
			instrFreq = instr;
		}
		if(ingrFlag) {
			for(var i = 0; i < ingrFreq.length; i++) {
				if(ingrFreq[i].key === keyword) {
					var score = i/(ingrFreq.length);
					if(score < 0.25) {
						return colorGradient[0];
					} else if (score < 0.5) {
						return colorGradient[1];
					} else if (score < 0.75) {
						return colorGradient[2];
					} else {
						return colorGradient[3];
					}
				}
			}
		} else {
			for(var i = 0; i < instrFreq.length; i++) {
				if(instrFreq[i].key === keyword) {
					var score = i/(instrFreq.length);
					if(score < 0.25) {
						return colorGradientS[0];
					} else if (score < 0.5) {
						return colorGradientS[1];
					} else if (score < 0.75) {
						return colorGradientS[2];
					} else {
						return colorGradientS[3];
					}
				}				
			}
		}
	}

	function updateTop5(ingr, instr) {
		if(ingr) {
			var ingrArr = ingr.splice(0,5);
			var top5Template = Handlebars.compile($("#top5_template").html());
			debugger;
			console.log(ingrArr);
			var test = top5Template("yooo");
			console.log(test);
			$("#top5_content").html(top5Template({results: ingrArr}));	
		}	
	}

	GraphRenderer.render = function(index, ingrFreq, instrFreq) {
		var pairs = JSON.parse(window.sessionStorage.getItem('pairs'));
		var pairIndex = window.sessionStorage.getItem('currGraphIndex');
		pairIndex = parseInt(pairIndex);
		if(pairIndex >= pairs.length) {
			return;
		}
		
		var rowIndex = pairs[pairIndex][0];
		var colIndex = pairs[pairIndex][1];
		console.log(rowIndex);
		console.log(colIndex);
		if(!graphIndex) {
			sessionStorage.setItem('currGraphIndex', pairIndex + 1);
		}
		var g = new dagreD3.graphlib.Graph({compound:true}).setGraph({});	
		var currGraph = window.sessionStorage.getItem('currSearch');
		currGraph = JSON.parse(currGraph);
		var edges = currGraph[index][1];
		var states = currGraph[index][0];
		var clusters = currGraph[index][2];
		var recipe_name = currGraph[index][3];

		console.log(clusters);
		updateTop5(ingrFreq, instrFreq);
	    Object.keys(states).forEach(function(state) {
	      var flag=false;
	      var value = states[state];
	      value.label = state;
	      console.log(ingrFreq);
	      if ('style' in value) {
	      	flag = true;
	      }
	      var hex = calculateHex(value.label, flag, ingrFreq, instrFreq);
	      value.style = "fill: " +  hex;
	      value.rx = value.ry = 5;
	      g.setNode(state, value);
	    });

	    for(key in clusters) {
			g.setNode(key+"GROUP", {label: '', clusterLabelPos: 'top', style: 'fill: #d3d7e8'});
			var associated = clusters[key];
			g.setParent(key, key+"GROUP");
			for(var i = 0; i < associated.length;i++) {
				g.setParent(associated[i], key+"GROUP");
			}
		}
	      // Add states to the graph, set labels, and style
	    for(key in edges) {
	      var secondEdges = edges[key];
	      for(var j = 0; j < secondEdges.length; j++) {
	        g.setEdge(key, secondEdges[j], { label: "" });
	      }
	    }
	    // Create the renderer
	    var render = new dagreD3.render();
	    // Set up an SVG group so that we can translate the final graph.
	    var selector = "#first";
	    if (graphIndex) {
	    	graphIndex = false;
	    } else {
	    	$("#row"+rowIndex).append('<div class="col-md-4 parent-closed"><div class="panel panel-widget"><div class="panel-title" style="font-size:7pt">'+recipe_name+'<ul class="panel-tools"><li><input id="'+'Check'+index+'" type="checkbox"></li><li><a id="closed'+index+'" class="icon closed-tool"><i class="fa fa-times"></i></a></li></ul></div><svg id="'+'Panel'+index+'" style="width: 100%; height: 350px"></svg></div></div>');
	    	selector = "#" + "Panel" + index;
	    }
	    $(document).ready(function(){
		  $(".panel-tools .closed-tool").click(function(event){
		  	$(this).parents(".parent-closed").html('');
		  	RenderClosed.render();
		  });
		}); 
	    $(selector).html('');
	    var svg = d3.select(selector);
	    var inner = svg.append("g");
	    inners.push([inner, index]);
	    // Set up zoom support
	    var zoom = d3.behavior.zoom().on("zoom", function() {
	    	inner.attr("transform", "translate(" + d3.event.translate + ")" +
	            "scale(" + d3.event.scale + ")");
	    	for(var i = 0; i < inners.length; i++) {
	    		var inner1 = inners[i][0];
	    		var index = inners[i][1];
	    		if($("#Check"+index).is(":checked")) {
	    			inner1.attr("transform", "translate(" + d3.event.translate + ")" +
	                "scale(" + d3.event.scale + ")");
	    		}
	    	}
	    });
	    svg.call(zoom);
	    // Simple function to style the tooltip for the given node.
	    var styleTooltip = function(name, description) {
	      return "<p class='name'>" + name + "</p><p class='description'>" + description + "</p>";
	    };
	    // Run the renderer. This is what draws the final graph.
	    render(inner, g);
	    inner.selectAll("g.node")
	      .attr("title", function(v) { return styleTooltip(v, g.node(v).description) })
	      .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); });
	    // Center the graph
	    var initialScale = 0.25;
	    zoom
	      .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 10])
	      .scale(initialScale)
	      .event(svg);
	    svg.attr('height', g.graph().height * initialScale + 40);
	    // Set up zoom support
	};
	window.GraphRenderer = GraphRenderer;
})();
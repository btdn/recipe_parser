(function(){
	var GraphRenderer = {};

	var colorGradient = ["#CC8866", "#E08152", "#F57A3D", "#FF5500"];
	var colorGradientS = ['#B8D3E0', '#94BDD1', '#70A7C2', '#4D90B2'];
	var ingrFreq = null;
	var instrFreq = null;
	var graphIndex = "#first";

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
			$("#top5_content").html(top5Template({results: ingrArr}));	
		}	
	}

	GraphRenderer.render = function(index, ingrFreq, instrFreq) {
		var g = new dagreD3.graphlib.Graph().setGraph({});	
		var currGraph = window.sessionStorage.getItem('currSearch');
		currGraph = JSON.parse(currGraph);
		var edges = currGraph[index][1];
		var states = currGraph[index][0];
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
	      console.log(value.label);
	      console.log(flag);
	      console.log(hex);
	      value.style = "fill: " +  hex;
	      value.rx = value.ry = 5;
	      g.setNode(state, value);
	    });
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
	    $(graphIndex).html('');
	    var svg = d3.select(graphIndex),
	        inner = svg.append("g");
	    // Set up zoom support
	    var zoom = d3.behavior.zoom().on("zoom", function() {
	        inner.attr("transform", "translate(" + d3.event.translate + ")" +
	                                    "scale(" + d3.event.scale + ")");
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
	    var zoom = d3.behavior.zoom().on("zoom", function() {
	        inner.attr("transform", "translate(" + d3.event.translate + ")" +
	                                    "scale(" + d3.event.scale + ")");
	    });
	    svg.call(zoom);
	    svg.attr('height', g2.graph().height * initialScale + 40);
	};
	window.GraphRenderer = GraphRenderer;
})();
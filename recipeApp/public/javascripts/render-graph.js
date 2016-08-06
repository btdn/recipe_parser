(function(){
	var GraphRenderer = {};

	GraphRenderer.render = function(index) {
		var g = new dagreD3.graphlib.Graph().setGraph({});

		var currGraph = window.sessionStorage.getItem('currSearch');
		currGraph = JSON.parse(currGraph);
		var edges = currGraph[index][1];
		var states = currGraph[index][0];
				    // Add states to the graph, set labels, and style
	    Object.keys(states).forEach(function(state) {
	      var value = states[state];
	      value.label = state;
	      value.rx = value.ry = 5;
	      g.setNode(state, value);
	    });

	      // Add states to the graph, set labels, and style
	    for(key in edges) {
	      var secondEdges = edges[key];
	      for(var j = 0; j < secondEdges.length; j++) {
	        console.log(key);
	        console.log(secondEdges[j]);
	        g.setEdge(key, secondEdges[j], { label: "" });
	      }
	    }
	            //console.log(levenshteinDistance(test1, test2));
	    // Create the renderer
	    var render = new dagreD3.render();

	    // Set up an SVG group so that we can translate the final graph.
	    $("#first").html('');
	   
	    var svg = d3.select("#first"),
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
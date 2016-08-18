(function(){
	var MultigraphRenderer = {};


	function add_to_hist(obj, histogram) {
		for(var key in obj) {
			if(key in histogram) {
				histogram[key] += 1
			} else {
				histogram[key] = 1;
			}
		}
		return histogram;
	}

	function merge_options(obj1,obj2){
		var obj3 = {};
		for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
		for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
		return obj3;
	}

	function ColorLuminance(hex, lum) {
		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}
		return rgb;
	}

	function calculateHex(origHex, key, histogram) {
		if(histogram[key] == 1) {
			return origHex;
		}
		var value = histogram[key] * -0.08;
		return ColorLuminance(origHex, value);
	}

	MultigraphRenderer.render = function (indexes) {
		var totalEdges = {};
		var totalStates = {};
		var histogram = {};
		var currGraph = window.sessionStorage.getItem('currSearch');
		currGraph = JSON.parse(currGraph);
		var g = new dagreD3.graphlib.Graph({compound:true}).setGraph({});
		for (var i = 0; i < indexes.length; i++) {
			var edges = currGraph[indexes[i]][1];
			var states = currGraph[indexes[i]][0];
			histogram = add_to_hist(states, histogram);
			totalEdges = merge_options(edges, totalEdges);
			totalStates = merge_options(states, totalStates);
			var clusters = currGraph[indexes[i]][2];
		}
		var states = totalStates;
		var edges = totalEdges;
		console.log(currGraph);
		console.log(indexes);
		console.log(states);
		console.log(edges);
	    Object.keys(states).forEach(function(state) {
	      var flag=false;
	      var value = states[state];
	      value.label = state;
	      if ('style' in value) {
	      	flag = true;
	      }
	      var hex = calculateHex('#FFFFFF', state, histogram);
	      value.style = "fill: " +  hex;
	      value.rx = value.ry = 5;
	      g.setNode(state, value);
	    });

	  /*  for(key in clusters) {
			g.setNode(key+"GROUP", {label: '', clusterLabelPos: 'top', style: 'fill: #d3d7e8'});
			var associated = clusters[key];
			g.setParent(key, key+"GROUP");
			for(var i = 0; i < associated.length;i++) {
				g.setParent(associated[i], key+"GROUP");
			}
		} */
	      // Add states to the graph, set labels, and style
	    for(key in edges) {
	      var secondEdges = edges[key];
	      for(var j = 0; j < secondEdges.length; j++) {
	        g.setEdge(key, secondEdges[j], { label: "" });
	      }
	    }
	    console.log(edges);
	    console.log(states);
	    // Create the renderer
	    var render = new dagreD3.render();
	    var selector = "#first";
	    	    $(selector).html('');
	    var svg = d3.select(selector);
	    var inner = svg.append("g");

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
	  //    .attr("id", function(d, i){ console.log(index); var result = 'index'+index+'-'+textIndexes[i]; return result; })
	  //	  .each(function(v) { $(this).attr('id',  'index'+index+'-'+textIndexes[v]); })
	      .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); })
	    // Center the graph
	    var initialScale = 0.25;
	    zoom
	      .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 10])
	      .scale(initialScale)
	      .event(svg);
	    svg.attr('height', g.graph().height * initialScale + 40);
	    // Set up zoom support

	};
	window.MultigraphRenderer = MultigraphRenderer;
})();
(function(){
	var GraphRenderer = {};

	var colorGradient = ["#CC8866", "#E08152", "#F57A3D", "#FF5500"];
	var colorGradientS = ['#B8D3E0', '#94BDD1', '#70A7C2', '#4D90B2'];
	var ingrFreq = null;
	var instrFreq = null;
	var graphIndex = true;
	var inners = [];

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

	function calculate(origHex, value) {
		return ColorLuminance(origHex, value);
	}


	function calculateHex(keyword, ingrFlag, ingr, instr) {
		if(ingr) {
			ingrFreq = ingr;
			instrFreq = instr;
		}
	//	if(ingrFlag) {
			for(var i = 0; i < ingrFreq.length; i++) {
				if(ingrFreq[i].key === keyword) {
					var score = i/(ingrFreq.length);
					return calculate("#CCFFCC", -1 * (0.25 - score))
				}
			}
	//	} else {
			for(var i = 0; i < instrFreq.length; i++) {
				if(instrFreq[i].key === keyword) {
					var score = i/(instrFreq.length);
					return calculate('#FFFFFF', -1 * (0.25 - score) )
				} else if (instrFreq[i].key === keyword.toUpperCase()) {
					var score = i/(instrFreq.length);
					return calculate('#e8f4f8', -1 * (0.25 - score) )
				}					
			}
		return -1;
	//	}
	}

	function updateTop5(ingr, instr) {
		if(ingr) {
			var ingrArr = [];
			var instrArr = [];
			for(var i = 0; i < 5; i++) {
				if(i < ingr.length) {
					ingrArr.push(ingr[i]);
					instrArr.push(instr[i]);
				}
			}
			var top5Template = Handlebars.compile($("#top5_template").html());
			$("#top5_content").html(top5Template({results: ingrArr}));
			$("#top5_content_action").html(top5Template({results: instrArr}));	
		}	
	}

	function formatTextColor(wordChunk, ingrFreq, instrFreq) {
		var arr = wordChunk.split(" ");
		var finalResult = "";
		for(var i = 0; i < arr.length; i++) {
			var result = calculateHex(arr[i], null, ingrFreq, instrFreq);
			if(result == -1) {
				finalResult += arr[i];
				finalResult += " ";
			} else {
				finalResult += "<span style='background-color:"+result+"'><b>"
				finalResult += arr[i];
				finalResult += "</b></span>"
				finalResult += " ";
			}
		}
		console.log(finalResult);
		return finalResult;
	}

	GraphRenderer.render = function(index, ingrFreq, instrFreq, optionalIndex2) {
		var pairs = JSON.parse(window.sessionStorage.getItem('pairs'));
		var pairIndex = window.sessionStorage.getItem('currGraphIndex');
		pairIndex = parseInt(pairIndex);
		var selector = "#first";
		if(pairIndex >= pairs.length) {
			return;
		}
		var rowIndex = pairs[pairIndex][0];
		var colIndex = pairs[pairIndex][1];
		if(!graphIndex && !optionalIndex2) {
			sessionStorage.setItem('currGraphIndex', pairIndex + 1);
		}
		var g = new dagreD3.graphlib.Graph({compound:true}).setGraph({});	
		var currGraph = window.sessionStorage.getItem('currSearch');
		currGraph = JSON.parse(currGraph);
		var edges = currGraph[index][1];
		var states = currGraph[index][0];
		var clusters = currGraph[index][2];
		var recipe_name = currGraph[index][3];
		var justText = currGraph[index][4];
		var textIndexes = currGraph[index][5];
		var formatString = "";
		for(var i = 0; i < justText.length; i++) {
			formatString += "<li id='text"+index+"-"+i+"' style='padding: 0px;'>";
			justText[i] = formatTextColor(justText[i], ingrFreq, instrFreq);
			formatString += justText[i];
			formatString += "</li>";
		}
		if(optionalIndex2) {
			graphIndex = true;
			selector = optionalIndex2;
		}
		
		updateTop5(ingrFreq, instrFreq);
	    Object.keys(states).forEach(function(state) {
	      var flag=false;
	      var value = states[state];
	      value.label = state;
	      if ('style' in value) {
	      	flag = true;
	      }
	      var hex = calculateHex(value.label, flag, ingrFreq, instrFreq);
	      value.style = "fill: " +  hex;
	      value.rx = value.ry = 5;
	      g.setNode(state, value);
	    });

	 /*   for(key in clusters) {
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
	    // Create the renderer
	    var render = new dagreD3.render();
	    // Set up an SVG group so that we can translate the final graph.
	    
	    if (graphIndex) {
	    	graphIndex = false;
	    } else {
	    	$("#row"+rowIndex).append('<div class="col-md-4 parent-closed" style="padding:0px; margin-bottom:0px"><div class="panel panel-widget" style="margin-bottom:0px;"><div class="panel-title truncate clickPanel" id="panel'+index+'" style="font-size:7pt">'+recipe_name+'<ul class="panel-tools"><li><a id="graph'+index+'" href="#union-graph"><input id="'+'Check'+index+'" type="checkbox"></a></li><li><a id="closed'+index+'" class="icon closed-tool"><i class="fa fa-times"></i></a></li></ul></div><div class="row"><div class="col-md-4" style="padding: 0px; overflow: scroll; height: 350px; word-wrap: break-word; font-size: 6pt">'+formatString+'</div><div class="col-md-8"><svg id="'+'Panel'+index+'" style="width: 100%; height: 350px"></svg></div></div></div></div>');
	    	selector = "#" + "Panel" + index;

	    }
	    $(document).ready(function(){
		  $(".panel-tools .closed-tool").click(function(event){
		  	$(this).parents(".parent-closed").html('');
		  	RenderClosed.render();
		  });
		}); 
		//AddListeners.listenNow();
	    $(selector).html('');
	    var svg = d3.select(selector);
	    var inner = svg.append("g");
	    inners.push([inner, index]);
	    // Set up zoom support
	    var zoom = d3.behavior.zoom().on("zoom", function() {
	    	$("html").addClass("stop-scrolling");
	    	$("body").addClass("stop-scrolling");
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
	    	$("body").removeClass("stop-scrolling");
	    	$("html").removeClass("stop-scrolling");
	    });
	    svg.call(zoom);

	    $("#Check"+index).click(function() {
	    	$('#graph'+index).click();
	    	var blesses = [];
	    	$('')
	    	for(var i = 0; i < inners.length; i++) {
	    		var index = inners[i][1];
	    		if($("#Check"+index).is(":checked")) {
	    			blesses.push(index);
	    		}
	    	}
	    	MultigraphRenderer.render(blesses);
	    });
	    // Simple function to style the tooltip for the given node.
	    var styleTooltip = function(name, description) {
	      return "<p class='name'>" + name + "</p><p class='description'>" + description + "</p>";
	    };
	    // Run the renderer. This is what draws the final graph.
	    render(inner, g);
	    inner.selectAll("g.node")
	      .attr("title", function(v) { return styleTooltip(v, g.node(v).description) })
	  //    .attr("id", function(d, i){ console.log(index); var result = 'index'+index+'-'+textIndexes[i]; return result; })
	  	  .each(function(v) { $(this).attr('id',  'index'+index+'-'+textIndexes[v]); })
	      .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); $(this).hover(function(){ var numberPattern = /\d+/g; var nums = this.id.match(numberPattern); $("#text"+nums[0]+"-"+nums[1]).toggleClass("backHover");}); });
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
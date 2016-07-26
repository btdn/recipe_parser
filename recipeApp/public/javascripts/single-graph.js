
// Create a new directed graph
var g = new dagreD3.graphlib.Graph().setGraph({});

//Create a second directed graph
var g1 = new dagreD3.graphlib.Graph().setGraph({});

//Create a common edges and states graph
var g2 = new dagreD3.graphlib.Graph().setGraph({});

var recognizeAssociations = {
  'dough' : ['flour'],
  'sandwich' : ['bread'],
  'toast' : ['bread'],
  'slice' : ['bread', 'roll'],
  'dry' : ['flour', 'salt', 'powder'],
  'wet' : ['egg', 'butter'],
};

var nodeList = [];

var nodeSet = {};

var branchSet = {};

var seenBeforeIngr = {};

var seenBefore = {};

var mostRecentNode = '';

// function addToNodeList(firstNode, nextNode, ingrFlag) {

// }

// function getRecentNode(keyWord) {
  
// }

function addToNodeList(firstNode, nextNode, ingrFlag) {
  var flag = true;
  console.log(firstNode);
  console.log(nextNode);
  for(var i=0;i<nodeList.length;i++) {
    var currNode = nodeList[i];
    if (ingrFlag && nextNode === currNode['node']) {
      nodeList[i]['assocIngr'][firstNode] = 1;
      flag = false;
    } else if (currNode['node'] === firstNode) {
      nodeList[i]['node'] = nextNode;
      flag = false;
    }
  }
  if(flag) {
    nodeList.push({'node': nextNode, 'assocIngr': {}});
    if (ingrFlag) {
      nodeList[0].assocIngr[firstNode] = 1;
    }
  }
  console.log(nodeList);
}

function getRecentNode(keyWord) {
  for(var i=0;i<nodeList.length;i++) {
    if(nodeList[i]['assocIngr'][keyWord]) {
      nodeList[i]['assocIngr'][keyWord] += 1;
      return nodeList[i]['node']; 
    }
  }
  return mostRecentNode;
}


ProgressModel.startLoad(function(error, jsonResults) {
  var ingredients = jsonResults['data'][1][1];
  var instructions = jsonResults['data'][1][0];
  var states = {}
  var edges = {}
  for(i = 0; i < ingredients.length; i++) {
    ingredient = ingredients[i]
    states[ingredient['name']] = { 
  //  states['ingr'+i] = { 
      description : "name: " + ingredient['name'] + "\n" + 
        "amount: " + ingredient['amount'] + " " + ingredient['amountMetric'],
      style : "fill: #f77",
    };
  }

  for(i = 0; i < instructions.length; i++) {
    instruction = instructions[i]
  //  states['instr'+i] = { 
    var input = instruction['keyword'];
    if (seenBefore[input]) {
      seenBefore[instruction['keyword']] += 1;
      input = instruction['keyword'] + seenBefore[instruction['keyword']].toString();
      instructions[i]['keyword'] = input;
    }
    seenBefore[input] = 1;
    states[input] = {
      description : instruction['text']
    };
  }


  // Add states to the graph, set labels, and style
  Object.keys(states).forEach(function(state) {
    var value = states[state];
    value.label = state;
    value.rx = value.ry = 5;
    g.setNode(state, value);
  });

  // Set up the edges
  for(i = 0; i < instructions.length; i++) {
    var associatedIngrs = instructions[i]['associatedIngr'];
    associatedIngrs = associatedIngrs.filter(function(item, pos) {
      return associatedIngrs.indexOf(item) == pos;
    });
    for(j = 0; j < associatedIngrs.length; j++) {
      var ingr = associatedIngrs[j];
      if (ingr < ingredients.length) {
      //  g.setEdge("ingr"+ingr, "instr"+i, { label: "" });
          if(seenBeforeIngr[ingredients[ingr]['name']]) {
            seenBeforeIngr[ingredients[ingr]['name']] += 1;
            var mostRecent = getRecentNode(ingredients[ingr]['name']);
            mostRecentNode = mostRecent;
            if (mostRecent != instructions[i]['keyword']) {
              g.setEdge(mostRecent, instructions[i]['keyword'], { label: "" });
              addToNodeList(mostRecent, instructions[i]['keyword'], false); 
            }
            if (edges[mostRecent]) {
              edges[mostRecent].push(instructions[i]['keyword']);
            } else {
              edges[mostRecent] = [instructions[i]['keyword']];
            }  
          } else {
            seenBeforeIngr[ingredients[ingr]['name']] = 1;
            g.setEdge(ingredients[ingr]['name'], instructions[i]['keyword'], { label: "" });
            addToNodeList(ingredients[ingr]['name'], instructions[i]['keyword'], true); 
            mostRecentNode = instructions[i]['keyword'];
            if (edges[ingredients[ingr]['name']]) {
              edges[ingredients[ingr]['name']].push(instructions[i]['keyword']);
            } else {
              edges[ingredients[ingr]['name']] = [instructions[i]['keyword']];
            }  
          }
          console.log("EDGE SET");        
      } else {
        console.log("Setting edge after ingredients" + i)
     //   g.setEdge("instr"+(i-1), "instr"+i, { label: "" }); 
        g.setEdge(instructions[i-1]['keyword'], instructions[i]['keyword'], { label: "" });
        addToNodeList(instructions[i-1]['keyword'], instructions[i]['keyword'], false); 
        if (edges[instructions[i-1]['keyword']]) {
          edges[instructions[i-1]['keyword']].push(instructions[i]['keyword']);
        } else {
          edges[instructions[i-1]['keyword']] = [instructions[i]['keyword']];
        }   
      }
    }
  }

  // Create the renderer
  var render = new dagreD3.render();

  // Set up an SVG group so that we can translate the final graph.
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
  var initialScale = 0.75;
  zoom
    .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 20])
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
});


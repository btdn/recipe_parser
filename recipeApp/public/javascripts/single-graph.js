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

var branchSet = {};
var nodeList = [];



var mostRecentNode = '';

var test1 = ["semisweet chocolate", "orange zest", "pecan", "oat", "clove", "nutmeg", "cinnamon", "baking soda", "flour", "egg", "vanilla extract", "salt", "brown sugar", "sugar", "butter", "PREHEAT", "LINE", "BEAT", "ADD", "BEAT2", "STIR", "SIFT", "ADD2", "FLOUR", "ADD3", "STIR2", "DROP", "BAKE", "REMOVE", "COOL", "STORE"];
var test2 = ["bittersweet chocolate", "semisweet chocolate", "vanilla extract", "egg", "brown sugar", "sugar", "butter", "salt", "baking soda", "flour", "baking sheets; paper equipment: parchment special", "POSITION", "PREHEAT", "LINE", "SIFT", "COMBINE", "BEAT", "ADD", "BEAT2", "ADD2", "ADD3", "FOLD", "COVER", "WRAP", "CHILL", "DROP", "BAKE", "LOWER", "COOL", "COOL2", "CONTINUE"];
var test3 = ["scant bar butterfinger candy", "bittersweet semisweet chocolate", "vanilla extract", "egg", "brown sugar", "sugar", "butter", "butter peanut", "salt", "baking powder", "flour", "PREHEAT", "LINE", "WHISK", "BLEND", "BEAT", "BEAT2", "STIR", "PLACE", "ROLL", "FORM", "ROLL2", "PRESS", "BAKE", "TRANSFER", "COOL"]
function isUppercase(word) {
  return (word === word.toUpperCase()); 
}

function calculateChangeCost(word1, word2, similarities) {
  var word1 = word1.replace(/[0-9]/g, '');
  var word2 = word2.replace(/[0-9]/g, '');
  if(isUppercase(word1) && isUppercase(word2)) { //return similarity case
    if (word1 in similarities && word2 in similarities[word1]) {
      return 1 - similarities[word1][word2];
    }
    return 1;
  } else if (isUppercase(word1) || isUppercase(word2)) {
    return 1;
  } else { 
    wordArr1 = word1.split(" ");
    wordArr2 = word2.split(" ");
    var counter = 0;
    for(i=0;i<wordArr1.length;i++) {
      for(j=0;j<wordArr2.length;j++) {
        if(wordArr1[i] == wordArr2[j]) {
          counter ++;
        }
      }
    }
    return 1 - counter/(wordArr1.length + wordArr2.length);
  }
}

var memo = {};
function levenshteinDistance (a, b, similarities) {
    if (!a.length) {
      return b.length;
    }
    if (!b.length) {
      return a.length;
    }
    if (!memo[a.length.toString() + b.length.toString()]) {
      t1 = levenshteinDistance(a.slice(1), b, similarities) + 0.25;
      t2 = levenshteinDistance(a, b.slice(1), similarities) + 0.25;
      t3 = levenshteinDistance(a.slice(1), b.slice(1), similarities) + (a[0] !== b[0] ? calculateChangeCost(a[0], b[0], similarities) : 0);
      memo[a.length.toString() + b.length.toString()] = Math.min(t1, t2, t3);
    }
    return memo[a.length.toString() + b.length.toString()];
}

var topologicalSort = (function () {
    function topologicalSortHelper(node, visited, temp, graph, result) {
      temp[node] = true;
      var neighbors = graph[node];
      for (var i = 0; i < neighbors.length; i += 1) {
        var n = neighbors[i];
        if (temp[n]) {
          console.log('The graph is not a DAG');
          return [];
        }
        if (!visited[n]) {
          topologicalSortHelper(n, visited, temp, graph, result);
        }
      }
      temp[node] = false;
      visited[node] = true;
      result.push(node);
    }

    return function (graph) {
      var result = [];
      var visited = [];
      var temp = [];
      for (var node in graph) {
        if (!visited[node] && !temp[node]) {
          topologicalSortHelper(node, visited, temp, graph, result);
        }
      }
      return result.reverse();
    };
}());

function tsne(dists) {
  var opt = {}
  opt.epsilon = 10; // epsilon is learning rate (10 = default)
  opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
  opt.dim = 2; // dimensionality of the embedding (2 = default)

  var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

  // initialize data. Here we have 3 points and some example pairwise dissimilarities 
  tsne.initDataDist(dists);

  for(var k = 0; k < 500; k++) {
    tsne.step(); // every time you call this, solution gets better
  }

  var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot
  return Y;
}


function addToNodeList(firstNode, nextNode, ingrFlag) {
  var flag = true;
  for(var i=0;i<nodeList.length;i++) {
    var currNode = nodeList[i];
    if (ingrFlag && nextNode === currNode['node']) {
      nodeList[i]['ingr'][firstNode] = 1;
      return
    } else if (currNode['node'] === firstNode) {
      nodeList[i]['node'] = nextNode;
      return
    }
  }
  nodeList.push({'node': nextNode, 'ingr': []});
  if (ingrFlag) {
    nodeList[0].ingr[firstNode] = 1;
  }

}

function getRecentNode(keyWord) {
  for(var k=0;k<nodeList.length;k++) {
    if(nodeList[k]['ingr'][keyWord]) {
      nodeList[k]['ingr'][keyWord] += 1;
      return nodeList[k]['node']; 
    }
  }
  return mostRecentNode;
}

function processStatesAndEdges(ingredients, instructions, seenBeforeIngrTotal, seenBeforeInstrTotal) {
  nodeList = []
  var states = {};
  var seenBeforeIngr = {};
  var edges = {};
  var seenBefore = {};
  for(i = 0; i < ingredients.length; i++) {
    ingredient = ingredients[i]
    if(seenBeforeIngrTotal[ingredient['name']]) {
      seenBeforeIngrTotal[ingredient['name']] += 1;
    } else {
      seenBeforeIngrTotal[ingredient['name']] = 1;
    }
    states[ingredient['name']] = { 
  //  states['ingr'+i] = { 
      description : "name: " + ingredient['name'] + "\n" + 
        "amount: " + ingredient['amount'] + " " + ingredient['amountMetric'],
      style : "fill: #f77",
    };
  }

  for(i = 0; i < instructions.length; i++) {
    instructions[i]['keyword'] = instructions[i]['keyword'].toUpperCase();
    instruction = instructions[i];
    if(seenBeforeInstrTotal[instruction['keyword']]) {
      seenBeforeInstrTotal[instruction['keyword']] += 1;
    } else {
      seenBeforeInstrTotal[instruction['keyword']] = 1;
    }
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

  // Set up the edges
  for(i = 0; i < instructions.length; i++) {
    var associatedIngrs = instructions[i]['associatedIngr'];
    associatedIngrs = associatedIngrs.filter(function(item, pos) {
      return associatedIngrs.indexOf(item) == pos;
    });
    //iterate through ingredients associated with instructions
    for(j = 0; j < associatedIngrs.length; j++) {
      var ingr = associatedIngrs[j];
      if (ingr < ingredients.length) { //set up ingredient -> instruction edges
          if(seenBeforeIngr[ingredients[ingr]['name']]) { //connects this special case to the most recently
            //used node connected to the associated ingredient
            seenBeforeIngr[ingredients[ingr]['name']] += 1;
            var mostRecent = getRecentNode(ingredients[ingr]['name']);
            mostRecentNode = mostRecent;
            if (mostRecent != instructions[i]['keyword']) {
              addToNodeList(mostRecent, instructions[i]['keyword'], false); 
              if (edges[mostRecent] && edges[mostRecent].length == 0) {
                edges[mostRecent].push(instructions[i]['keyword']);
              } else {
                edges[mostRecent] = [instructions[i]['keyword']];
              }  
            }
          } else { //connect directly to the ingredient itself
              seenBeforeIngr[ingredients[ingr]['name']] = 1;
              addToNodeList(ingredients[ingr]['name'], instructions[i]['keyword'], true); 
              mostRecentNode = instructions[i]['keyword'];
              if (edges[ingredients[ingr]['name']] && edges[ingredients[ingr]['name']].length == 0) {
                edges[ingredients[ingr]['name']].push(instructions[i]['keyword']);
              } else {
                edges[ingredients[ingr]['name']] = [instructions[i]['keyword']];
              }
          }      
      } else { //set up instruction -> instruction edges...
        if (!edges[instructions[i]['keyword']]) {
          addToNodeList(instructions[i-1]['keyword'], instructions[i]['keyword'], false); 
          if (edges[instructions[i-1]['keyword']] && edges[instructions[i-1]['keyword']].length == 0) {
            edges[instructions[i-1]['keyword']].push(instructions[i]['keyword']);
          } else {
            edges[instructions[i-1]['keyword']] = [instructions[i]['keyword']]; 
          }  
          edges[instructions[i]['keyword']] = []; 
        }
      }
    }
  }
  return [states, edges];
}


ProgressModel.startLoad(function(error, jsonResults) {
  var seenBeforeIngrTotal = {};
  var seenBeforeInstrTotal = {};
  $("#searchSize").text(jsonResults['data'].length);
  var finalResults = [];
  $.getJSON("javascripts/moo.json", function(jsonCurr) { //json containing all word2vec similarity
    //scores of the cooking verbs
    var min = 100000000000000000000000000;
    var max = 0;
    var maxState = [];
    var minState = [];
    var minIndex = 0;
    var finalResults = [];
    var currSearch = [];
    for(var i = 0; i < jsonResults['data'].length; i++) {
      var ingredients1 = jsonResults['data'][i][1];
      var instructions1 = jsonResults['data'][i][0];
      var packed1 = processStatesAndEdges(ingredients1, instructions1, seenBeforeIngrTotal, seenBeforeInstrTotal);
      var states1 = packed1[0];
      var edges1 = packed1[1];
      currSearch.push([states1, edges1]);
    }

    for(var i = 0; i < jsonResults['data'].length; i++) {
      var edges1 = currSearch[i][1];
      var vertices1 = topologicalSort(edges1);
      var counter = 0;
      finalResults.push([]);
      for(var j = 0; j < jsonResults['data'].length; j++) {
        var edges2 = currSearch[j][1];
        var vertices2 = topologicalSort(edges2);
        var count = levenshteinDistance(vertices1, vertices2, jsonCurr);
        counter += count;
        finalResults[i].push(count);
      }
      if(counter < min) {
        min = counter;
        minState = [states1, edges1];
        minIndex = i;
      }
      if(counter > max) {
        max = counter;
        maxState = [states1, edges1];
      }
    }
    
    var freqIngr = [];
    for(key in seenBeforeIngrTotal) freqIngr.push({key: key, freq: seenBeforeIngrTotal[key]});
    freqIngr.sort(function(a,b){return b.freq - a.freq})
    var freqInstr = [];
    for(key in seenBeforeInstrTotal) freqInstr.push({key: key, freq: seenBeforeInstrTotal[key]});
    freqInstr.sort(function(a,b){return b.freq - a.freq});

    finalResults = tsne(finalResults);

    for(var i = 0; i < finalResults.length;i++) {
      finalResults[i] = {
        id: i,
        x:  finalResults[i][0],
        y:  finalResults[i][1],
      };
      if (i == minIndex) {
        finalResults[i].marker = {fillColor: 'red'};
      }
    } 
    recipeChartView.render(finalResults);

    window.sessionStorage.setItem('currSearch', JSON.stringify(currSearch) );

    GraphRenderer.render(minIndex, freqIngr, freqInstr);
  });
});


(function() {
  TwoCompare = {}

  function calculateHex(keyword, instr) {
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
  }


  TwoCompare.render = function (index1, index2, similarities) {
    // Wrap text in a rectangle, and size the text to fit.
    // var example = [['preheat', 'butter', 'beat', 'add', 'beat2', 'add2', 'add3', 'mix', 'stir', 'drop', 'bake', 'cool', 'transfer', 'cool2', 'store'],
    //    ['preheat', 'line', 'heat', 'add','beat', 'beat2', 'stir', 'sift', 'add2', 'flour', 'add3', 'stir2' , 'drop', 'bake', 'remove', 'cool', 'store']];

    var currGraph = window.sessionStorage.getItem('currSearch');
    currGraph = JSON.parse(currGraph);
    var justText = [currGraph[index1][4], currGraph[index2][4]];
    var textIndexes = [currGraph[index1][5], currGraph[index2][5]];
    var justInstr = [currGraph[index1][7], currGraph[index2][7]];
   // var similarities = [[0, 0], [2, 4], [3, 6], [7,1]];
    var differencesA = [];
    var differencesB = [];
    console.log(justInstr);
    console.log(textIndexes);
    console.log(justText);


    var newXY = {};
    var xCounter = 270;
    var yCounter = 20;
    for(var i = 0; i < similarities.length; i++) {
      yCounter += 70;
      var index1 = similarities[i][0];
      var index2 = similarities[i][1];
      newXY[index1] = {"x": xCounter, "y": yCounter};
      newXY[index2 + justInstr[0].length] = {"x": xCounter + 250, "y": yCounter};
    }

    var simHist = {};

    var xCounter = 20;
    var yCounter = 20;

    var jsonText = [];
    for(var i = 0; i < justInstr.length; i++) {
      xCounter += 250;
      yCounter = 20;
      for(var j = 0; j < justInstr[i].length; j++) {
        yCounter += 70;
        console.log(justText[i]);
        console.log(textIndexes[i][justInstr[i][j]]);
        var wordArr = (justText[i][textIndexes[i][justInstr[i][j]]]).split(" ");
        var finalString = (j+1)+'.  ';
        for(var k = 0; k < wordArr.length; k++) {
          var wordChunk = wordArr[k];  
          if(wordChunk.toUpperCase() === justInstr[i][j].replace(/[0-9]/g, '')) {
            finalString += wordChunk.toUpperCase() + " ";
          } else {
            finalString += wordChunk;
            finalString += " ";
          }
        }
        console.log(finalString);
        jsonText.push({name: justInstr[i][j], text: finalString, x: xCounter, y: yCounter});
      }
    }
    console.log(jsonText);
    console.log(similarities);

    var svg = d3.select("#graphA")
    var container = svg.append("g")

          //    svg 
          container   
                  .data(similarities)
                var lines = container.attr("class", "line")
                    .selectAll("line").data(similarities)
                  //  .selectAll("line").data(json.nodes)
                  .enter()
                    lines.append("line")


     //               var line = lines.append("line")
            .attr("stroke", function(d) { 
              var index1 = d[0];
              var index2 = d[1];
              simHist[index1] = 1;
              simHist[index2 + justInstr[0].length] = 1;
              if(index2 >= index1) {
                return "gray";
              } else {
                return "red";
              }
            })
            .attr("stroke-width", "1")
            .attr("class", "lineUnselected")
                  .attr("x1", function (d) {
                    console.log(d);
                    var index1 = d[0];
                      return jsonText[index1].x + 195
                  })
                  .attr("y1", function (d) {
                    var index1 = d[0];
                      return jsonText[index1].y + 20
                  })
                  .attr("x2", function (d) {
                    var  index2 = d[1]+justInstr[0].length;
                      return jsonText[index2].x
                  })
                  .attr("y2", function (d) {
                    var  index2 = d[1]+justInstr[0].length;
                      return jsonText[index2].y +20
                  })
    
    console.log(simHist);
   var g = container.selectAll("g")

          .data(jsonText)


     
          .enter()
          .append("g")
          .attr("class", function(d, i) {
            if(simHist[i]) {
              jsonText[i].selected = true;
              return "selected";
            }
            jsonText[i].selected = false;
            return "unselected";
          })
          .attr("id", function(d, i) {
            return i;
          })




      g.on("click", function(d, i){
        console.log(this)
        d3.selectAll(".selected")
        .transition()
        .duration(1000)
        .ease('cubic')
        .attr("transform", function(v, index) { return ("translate("+(newXY[this.id]["x"] - $(this).find("rect").attr("x") )+", "+(newXY[this.id]["y"]-$(this).find("rect").attr("y"))+")" )})

      var counter = 0;
      var xCounter = 40;
      var yCounter = 20;
      var flag = false;
      console.log(justInstr[0].length);
      d3.selectAll(".unselected")
        .transition()
        .duration(1000)
        .ease('cubic')
        .attr("transform", function(v, i) { 
          counter += 1; yCounter += 70;
          if($(this).find("rect").attr("index") >= justInstr[0].length && !flag) {
            flag = true; yCounter = 90; xCounter = 750;
          } 
          return "translate("+(xCounter-$(this).find("rect").attr("x"))+","+(yCounter-$(this).find("rect").attr("y"))+")"})

       //     var unselected = [];
       //     for(var i = 0; i < jsonText.length; i++) {
       //        if(!jsonText[i].selected) {
       //          unselected.push(jsonText[i]);

       //        }
       //     }
       //     var g = container.selectAll("g")


       //    .data(unselected)

       // //     .each(function(d, i) {
           
       //          .transition()
       //        .duration(1000)
       //        .ease('cubic')

       //        .attr("transform", function(d, i) { counter += 1; yCounter += 70; if(i === justInstr[0].length) {yCounter = 90; xCounter = 900;}; return "translate("+(xCounter-d.x)+","+(yCounter-d.y)+")"})

              



       //     });
      d3.selectAll(".lineUnselected")
        .attr("opacity", 0)
        
    });

  console.log(newXY);

  var rect = g.append("rect")
      .attr("width", 200)
      .attr("height", 50)
  //    .attr("class", "shape")
      .attr("stroke", "black")
      .attr("index", function(d, i) { return i } )
      .attr("fill", function(d, i) { if(simHist[i]) {
        return "gray";
      } else {
        return "white";
      }})
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("transform", "translate(" + -5 + "," + -5 + ")");
      




  g.append("text")
      .text(function(d) { return d.text })
      .style("font-family","Avenir")
      .attr("font-size", "10px")
      .attr("index", function(d, i) { return i } )
      .each(function(d){
          d3plus.textwrap().container(d3.select(this)).draw();
          console.log(d3plus);

      })
      .on("click", function(d, i){
        console.log(this)
        console.log(i)
        d3.select(this)
        .transition()
        .duration(1000)
        .ease('cubic')
        .attr("x", newXY[i]["x"])
        .transition()
        .duration(300)
        .ease('cubic')
        .attr("y", newXY[i]["y"])
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
  //    .attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
    }

  };

  window.TwoCompare = TwoCompare;

})();
$(function () {
    var recipeChartView = {};

    recipeChartView.render = function(currData) {
        console.log(currData);
        $('#containerRecipeChart').highcharts({
            chart: {
                type: 'scatter',
                style: {fontFamily: 'Avenir'},
                
                zoomType: 'xy'
            },
            exporting: {enabled: false},
            title: {
                text: 'Recipe Map'
            },
            xAxis: {
                startOnTick: true,
                endOnTick: true,
             
                showLastLabel: true,
                plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 0,
          
                    zIndex: 3
              }]
            },
            yAxis: {
                plotLines: [{
                   color: 'black',
                   dashStyle: 'dot',
                   width: 2,
                   value: 0,
                   zIndex: 3
                }]
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    marker: {
                        states: {
                            select: {
                                fillColor: 'blue',
                                lineWidth: 0
                            }
                        }
                    }
                },
                scatter: {
                    marker: {
                        radius: 3.5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x}, {point.y}'
                    }
                }
            },
            series: [{
                name: 'recipe',
                color: 'rgba(223, 83, 83, .5)',
                data: currData,
                point: {
                    events: {
                        click: function() {
                            this.setState("select");
                            this.update({
                              marker:{
                                  fillColor:'blue',
                              }
                            });
                        },
                        select: function(event) {
                            var id = event.target.id;
                            GraphRenderer.render(id);
                        },
                    }

                } 
                    
            }]
        });
    }
    window.recipeChartView = recipeChartView;
});


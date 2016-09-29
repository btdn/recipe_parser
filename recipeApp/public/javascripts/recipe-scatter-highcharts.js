$(function () {
    var recipeChartView = {};

    recipeChartView.render = function(currData) {
        console.log(currData);
        var currSearch = JSON.parse(window.sessionStorage.getItem('currSearch'));
        var rectangle;
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'containerRecipeChart',
                    type: 'scatter',
                    style: {fontFamily: 'Avenir'},
                    
                    zoomType: 'xy',
                events: {
                    selection: function(event) {
                                    var xMin = chart.xAxis[0].translate((event.xAxis[0]||chart.xAxis[0]).min),
                                        xMax = chart.xAxis[0].translate((event.xAxis[0]||chart.xAxis[0]).max),
                                        yMin = chart.yAxis[0].translate((event.yAxis[0]||chart.yAxis[0]).min),
                                        yMax = chart.yAxis[0].translate((event.yAxis[0]||chart.yAxis[0]).max);

                                    rectangle.attr({
                                        x: xMin + chart.plotLeft,
                                        y: chart.plotHeight + chart.plotTop - yMax,
                                        width: xMax - xMin,
                                        height: yMax - yMin
                                    });
                                    var commonIndexes = [];
                                    for (var i = 0; i < this.series[0].data.length; i++) {
                                        var point = this.series[0].data[i];
                                        if(point.marker.lineWidth < 2) {
                                            point.update({marker: {
                                                fillColor: point.marker.fillColor,
                                            }

                                            });
                                        }
                                        
                                        if (point.x > event.xAxis[0].min &&
                                            point.x < event.xAxis[0].max &&
                                            point.y > event.yAxis[0].min &&
                                            point.y < event.yAxis[0].max) {
                                                commonIndexes.push(point.id);
                                                GraphRenderer.render(point.id);
                                                point.update({marker: {
                                                    fillColor: point.marker.fillColor,
                                                    lineColor: 'black',
                                                    lineWidth: '1.5'
                                                }

                                                });
                                    
                                        }
                                    }
                                    CircleRenderer.render(commonIndexes);
                            
                                    return false;
                            },
                },
                },
                 tooltip: {
            formatter: function() {
                return currSearch[this.point.id][3];
            },
            shared: true,
            crosshairs: true
        },
                
                exporting: {enabled: false},
                title: {
                    text: 'Recipe Map'
                },
                xAxis: {
                    labels: {
                enabled: false
            },
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
                    title: {
                text: null
            },
            labels: {
                enabled: false
            },
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
                                    lineColor: 'black',
                                    lineWidth: '2',
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
                    }
                },
                series: [{
                    name: 'recipe',
                    color: 'black',
                    data: currData,
                    point: {
                        events: {
                            click: function() {
                                this.setState("select");

                            },

                             
                        }

                    } 
                        
                }]
           // }
        });
        rectangle = chart.renderer.rect(0,0,0,0,0).css({
            stroke: 'black',
            strokeWidth: '.5',
            fill: 'black',
            fillOpacity: '.1'
        }).add();

        
    }
    window.recipeChartView = recipeChartView;
});


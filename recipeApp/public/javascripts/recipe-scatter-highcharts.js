$(function () {
    var recipeChartView = {};

    recipeChartView.render = function(currData) {
        console.log(currData);
        var currSearch = JSON.parse(window.sessionStorage.getItem('currSearch'));
        var rectangle;
        var chart = new Highcharts.Chart({
            chart: {
                backgroundColor: '#bdbdbd',
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
                                    console.log(this.series[0].data);
                                    for (var i = 0; i < this.series[0].data.length; i++) {
                                        var point = this.series[0].data[i];
                                        console.log(point);
                                        if(point.marker.lineColor === 'black') {
                                            point.update({marker: {
                                                fillColor: point.marker.fillColor,
                                                lineColor: 'gray',
                                            }

                                            });
                                         }
                                        
                                        if (point.x > event.xAxis[0].min &&
                                            point.x < event.xAxis[0].max &&
                                            point.y > event.yAxis[0].min &&
                                            point.y < event.yAxis[0].max) {
                                                commonIndexes.push(point.id);
                                                
                                                point.update({marker: {
                                                    fillColor: point.marker.fillColor,
                                                    lineColor: 'black',
                                                    lineWidth: 3,
                                                }

                                                });
                                                GraphRenderer.render(point.id);
                                    
                                        }
                                    }
                                    console.log(this.series[0].data);
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
                    gridLineWidth: 0,
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
                                    gridLineWidth: 0,
                minorGridLineWidth: 0,
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
                            lineColor: 'gray',
                            lineWidth: 1.25,
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
                                this.update({marker: {fillColor: this.marker.fillColor, lineColor: 'gray', lineWidth: 3}})
                                GraphRenderer.render(this.id); 
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


app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope) {
    var graphCount = 0;
    var myData;
    var ndx;
    var margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;

    //Ui-grid column definitions
    var charts = {};
    $scope.myDefs = [];

    //create graph from function
    $scope.createGraph = function(chartType, x, y, groupType, chartOptions) {

        var width = 280; //will come from the parent element, hardcoded for testing
        var height = 180; //will come from the parent element, hardcoded for testing
        var radius = 90; //will come from the parent element, hardcoded for testing
        var margins = {
            top: 5,
            left: 10,
            right: 10,
            bottom: 20 //move this to bar chart options
        };
        //Used for storing all chart options
        var chartObj;
        //Checks if the xAxis is number, and if it needs to be linear or ordinal
        var xAxisIsNumber;
        graphCount++;
        var id = "testId" + graphCount;
        d3.select('body').append('div')
            .attr("id", id);

        // var xAxisType = Number
        var all = ndx.groupAll()

        var userDimension = ndx.dimension(function(d) {
            if (parseInt(d[x])) {
                d[x] = Number(d[x]);
                xAxisIsNumber = true;
            };
            return d[x];
        });
        console.log('xAxisIsNumber:', xAxisIsNumber)
        if (groupType === "sum") {
            var userGroup = userDimension.group().reduceSum(function(d) {
                if (parseInt(d[y])) d[y] = Number(d[y]);

                return Number(d[y]);
            });
        } else if (groupType === "count") {
            var userGroup = userDimension.group().reduceCount(function(d) {
                if (parseInt(d[y])) d[y] = Number(d[y]);

                return d[y];
            });
        };

        var chart = dc[chartType]("#" + id);

        charts['chart' + graphCount] = {
            chart: chart,
            chartType: chartType
        };

        if (chartType === "pieChart") {
            chartObj = makePieChartObject(chartOptions, margins);
            chartObj.radius = radius;

        } else if (chartType === "barChart") {
            chartObj = makeBarChartObject(chartOptions, x, y, userDimension, userGroup, xAxisIsNumber);
            if(chartObj.gap*size >= width){
                chartObj.gap = width*.5/size;
            }
        } else if (chartType === "rowChart") {
            chartObj = makeRowChartObject(chartOptions, x, y, userDimension, userGroup, xAxisIsNumber);
            var size = userDimension.group().size();
            if(chartObj.gap*size >= height){
                chartObj.gap = height*.5/size;
            }
        };

        //Set all common chart stuff (height,width,dims,group)
        chartObj.width = width;
        chartObj.height = height;
        chartObj.dimension = userDimension;
        chartObj.group = userGroup;

        //passing in graphCount(i.e. the id) to keep functions expected input the same for both graph
        //creation and graph editing
        createChart(graphCount, chartObj)

    };

    //load data
    $scope.loadData = function(options) {
        d3.csv('../data/baseballData.csv', function(data) {

            myData = data //Store data 
            ndx = crossfilter(myData); //Sets up filter object for all charts to be connected

            $scope.myData = data;

            $scope.optionArray = Object.keys(data[0])

            //Adjusts ui-grid column options
            $scope.optionArray.forEach(function(title) {
                var cellObj = {
                    field: title,
                    width: 90
                }

                $scope.myDefs.push(cellObj);
            })
            $scope.$apply()
        });
    };

    // $scope.resize = chartOptions;

    //PieChart object creator 

    function createChart(id, chartOptions) {
        //Will be id instead of being hardcoded when switched to graph.service
        var chart = charts['chart' + id].chart;
        var keys = Object.keys(chartOptions);

        keys.forEach(function(key) {
            console.log(key, ":", chartOptions[key])
            chart[key](chartOptions[key])
        });
        dc.renderAll();
    };

    function makePieChartObject(chartOptions) {
        //label and title options are functions, need to figure out how to hard code those based on
        //user input.
        var pieChartOptions = {
            innerRadius: 0,
            slicesCap: 20,
            renderLabel: true,
            label: function(d) { //defaults to Key
                return d.key
            },
            title: function(d) { //defaults to key : value
                return [d.key, d.value].join(' : ');
            }
        };

        Object.keys(chartOptions).forEach(function(key) {
            pieChartOptions[key] = chartOptions[key];
        })

        return pieChartOptions;
    };

    function makeBarChartObject(chartOptions, x, y, userDimension, userGroup, xAxisIsNumber) {


        var barChartOptions = {
            margins: {
                top: 5,
                left: 10,
                right: 10,
                bottom: 20
            },
            centerBar: false, //'boolean' 
            // x: d3.scale.linear().domain([0,50]).range(['white','black']),//defaults to d3.scale.ordinal, if linear, do some math to figure out domain
            x: d3.scale.ordinal(),
            xUnits: dc.units.ordinal,
            title: function(d) { //{ /*Default to both, give option for either*/ } 
                return [d.key, d.value].join(' : ');
            },
            yAxisLabel: y, // 'value'  
            xAxisLabel: x, //'value' 
            elasticY: true, //'value' 
            //if linear then domain needs to be specified? Outside of options, in function
            gap: 20,
            renderHorizontalGridLines: true
        };

        //This sets the x axis to be linear if the axis is a number
        if (xAxisIsNumber) {
            var min = userDimension.bottom(1)[0][x];
            var max = userDimension.top(1)[0][x];
            barChartOptions.x = d3.scale.linear().domain([min, max]);
            barChartOptions.xUnits = dc.units.integers;
        }
        // if(chartOptions.x==="linear"){
        //     barChartOptions.x= d3.scale.linear().domain([0,50]).range(["white","black"]);
        //     barChartOptions.xUnits = null;
        //     chartOptions = {};
        //     console.log("ChartOptions",barChartOptions)
        // }

        Object.keys(chartOptions).forEach(function(key) {
            barChartOptions[key] = chartOptions[key];
        });


        return barChartOptions;
    }

    function makeRowChartObject(chartOptions, x, y, userDimension, userGroup, xAxisIsNumber) {

        var rowChartOptions = {
            title: function(d) { //defaults to key : value
                return [d.key, d.value].join(' : ');
            },
            elasticX: true,
            gap: 10,
            margins: {
                top: 5,
                left: 10,
                right: 10,
                bottom: 20
            } 
        };

        Object.keys(chartOptions).forEach(function(key) {
            rowChartOptions[key] = chartOptions[key];
        })

        return rowChartOptions;
    }

});

// chart
//                 .width(580)
//                 .height(180)
//                 .margins({
//                     top: 10,
//                     right: 50,
//                     bottom: 30,
//                     left: 40
//                 })
//                 .dimension(userDimension)
//                 .group(userGroup)
//                 .elasticY(true)
//                 .centerBar(false)
//                 .x(d3.scale.ordinal())
//                 .xUnits(dc.units.ordinal)
//                 .renderHorizontalGridLines(true)

// //make another pie
//     $scope.test3 = function(chartType) {
//         var margin = {
//                 top: 30,
//                 right: 20,
//                 bottom: 30,
//                 left: 50
//             },
//             width = 600 - margin.left - margin.right,
//             height = 270 - margin.top - margin.bottom;

//         d3.select('body').append('div')
//             .attr("id", "testId")

//         console.log(ndx)

//         var all = ndx.groupAll()
//         var leagueDim = ndx.dimension(function(d) {
//             var prop = Object.keys(d)[2]
//             return d[prop];
//         })

//         var playerDim = ndx.dimension(function(d) {
//             return d.Player
//         })

//         var hrGroup = leagueDim.group().reduceSum(function(d) {
//             return d.HR;
//         })

//         var avgGroup = leagueDim.group().reduceSum(function(d) {
//             return d.RBI
//         })

//         var playerHrGroup = playerDim.group().reduceSum(function(d) {
//             return d.HR
//         })

//         var chart = dc[chartType]('#testId2');
//         chart
//             .width(280)
//             .height(180)
//             .radius(100)
//             .innerRadius(30)
//             .dimension(playerDim)
//             .group(playerHrGroup)


//         dc.renderAll();
//     }

//make pie
// $scope.test2 = function() {
//     var margin = {
//             top: 30,
//             right: 20,
//             bottom: 30,
//             left: 50
//         },
//         width = 600 - margin.left - margin.right,
//         height = 270 - margin.top - margin.bottom;

//     d3.select('body').append('div')
//         .attr("id", "testId")


//     var all = ndx.groupAll()
//     var leagueDim = ndx.dimension(function(d) {
//         var prop = Object.keys(d)[2]
//         return d[prop];
//     })

//     var playerDim = ndx.dimension(function(d) {
//         return d.Player
//     })

//     var hrGroup = leagueDim.group().reduceSum(function(d) {
//         return d.HR;
//     })

//     var avgGroup = leagueDim.group().reduceSum(function(d) {
//         return d.RBI
//     })

//     var playerHrGroup = playerDim.group().reduceSum(function(d) {
//         return d.HR
//     })

//     var pieChart = dc.pieChart('#testId');
//     pieChart /* dc.pieChart('#quarter-chart', 'chartGroup') */
//         .width(180)
//         .height(180)
//         .radius(80)
//         .innerRadius(30)
//         .dimension(leagueDim)
//         .group(hrGroup);

//     dc.renderAll();
// }

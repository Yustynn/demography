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
    $scope.createGraph = function(chartType, x, y, groupType) {
        var id = "testId" + graphCount;
        console.log(id)
        graphCount++;
        d3.select('body').append('div')
            .attr("id", id);

        // var xAxisType = Number
        var all = ndx.groupAll()

        var userDimension = ndx.dimension(function(d) {

            return d[x];
        })

        if (groupType === "sum") {
            var userGroup = userDimension.group().reduceSum(function(d) {
                return d[y];
            });
        } else if (groupType === "count") {
            var userGroup = userDimension.group().reduceCount(function(d) {
                return d[y];
            });
        }

        var chart = dc[chartType]("#" + id);

        charts['chart' + graphCount] = {
            chart: chart,
            chartType: chartType
        };

        if (chartType === "pieChart") {
            chart
                .width(280)
                .height(180)
                .radius(100)
                .innerRadius(30)
                .dimension(userDimension)
                .group(userGroup)
        } else if (chartType === "barChart") {
            chart
                .width(580)
                .height(180)
                .margins({
                    top: 10,
                    right: 50,
                    bottom: 30,
                    left: 40
                })
                .dimension(userDimension)
                .group(userGroup)
                .filter("American")
                .elasticY(true)
                .centerBar(false)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .renderHorizontalGridLines(true)
        } else if (chartType === "rowChart") {
            chart
                .height(220)
                .margins({
                    top: 5,
                    left: 10,
                    right: 10,
                    bottom: 20
                })
                .dimension(userDimension)
                .group(userGroup)
                .title(function(d) {
                    return d.value;
                })
                .elasticX(true)
        }

        dc.renderAll();

    }

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

    var chartOptions = function(id, chartOptions) {
        //Will be id instead of being hardcoded when switched to graph.service
        var chart = charts['chart' + 1].chart;

        var obj = {width: 200, height: 200}
        var keys = Object.keys(obj);
        keys.forEach(function(key){
            console.log(typeof key)
            chart[key](obj[key])
        })

        dc.renderAll()
    }

    $scope.resize = chartOptions;

});

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

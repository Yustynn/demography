/*  GraphService
*
*   use this file for most of the graph logic, such as
*   create and update of all chart types.
*
*   'public' functions: this.someFunc = function(){}
    'private' functions: function someFunc(){}
*
*/

app.service('GraphService', function ($rootScope, DashboardFactory) {
    var self = this;
    var ndx, myData;

    this.create = function(id, chartType, xAxis, yAxis, groupType) {

        var chartContainer = $('#widget-container-' + id + '> .box-content > .widget-content-container')[0];
        var chartWidth = chartContainer.offsetWidth;
        var chartHeight = chartContainer.offsetHeight;
        var chartRadius = chartWidth < chartHeight ? chartWidth/2 : chartHeight/2;
        //console.log(chartWidth, chartHeight, chartRadius);
        ///var all = ndx.groupAll()

        var dim = ndx.dimension(function(d) {
            return d[xAxis];
        })

        var grp = dim.group().reduceSum(function(d) {
            return d[yAxis];
        })

        // var grp = dim.group().reduceSum(function(d) {
        //     return d.HR;
        // })

        //var chart = dc[chartType](chartContainer);
        var chart = dc[chartType]('#widget-container-' + id + '> .box-content > .widget-content-container');

        if (chartType === "pieChart") {
            chart
                .width(chartWidth)
                .height(chartHeight)
                .radius((chartWidth < chartHeight ? chartWidth/2 : chartHeight/2)*.8)
                .innerRadius(chartRadius/4)
                .dimension(dim)
                .group(grp)
        } else if (chartType === "barChart") {
            chart
                .width(chartWidth)
                .height(chartHeight * .8)
                .margins({
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                })
                .dimension(dim)
                .group(grp)
                .elasticY(true)
                .centerBar(true)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .renderHorizontalGridLines(true)
        }

        // chart.xAxis().tickFormat(
        //     function(v) {
        //         return v + '%';
        //     });
        // chart.yAxis().ticks(5);
        dc.renderAll();
    };

    this.resize = function(id){
        //http://plnkr.co/edit/kJDKH0?p=preview
        var chart = dc[chartType]('#widget-container-' + id + '> .box-content > .widget-content-container');
        var chartContainer = $('#widget-container-' + id + '> .box-content > .widget-content-container')[0];
        var chartWidth = chartContainer.offsetWidth;
          // var newWidth = document.getElementById('box-test').offsetWidth;
          chart.width(chartWidth)
            .transitionDuration(0);
          pie.transitionDuration(0);
          dc.renderAll();
          chart.transitionDuration(750);
          pie.transitionDuration(750);
    }

    //load data
    function loadData() {
        d3.csv('../data/baseballData.csv', function(data) {

            data.forEach(function(d) {
                d.Player = d.PLAYER,
                    d.Team = d.TEAM
            });

            myData = data
            ndx = crossfilter(myData);
            //console.log("NDX:", data)
            //$scope.optionArray = Object.keys(data[0])
            //$scope.$apply()
        });
    };

    $rootScope.$on('gridster-resized', function(sizes, gridster) {
        // sizes[0] = width
        // sizes[1] = height
        // gridster.
        console.log("the canvas has been resized");
    });

    $rootScope.$on('gridster-item-resized', function(item) {
        console.log("Do Sth");
        console.dir(item.$element);
        // item.gridster
        // item.row
        // item.col
        // item.sizeX
        // item.sizeY
        // item.minSizeX
        // item.minSizeY
        // item.maxSizeX
        // item.maxSizeY
    })

    //for now init data here
    loadData();
})

/*  GraphService
*
*   use this file for most of the graph logic, such as
*   create and update of all chart types.
*
*   'public' functions: this.someFunc = function(){}
*   'private' functions: function someFunc(){}
*
*/

app.service('GraphService', function(DashboardFactory) {
    var self = this;
    var ndx, myData;
    //Object to store all instances of chart to resize/edit specific chart
    var charts = {};

    this.data = myData;

    this.getData = function() {
        return myData;
    }

    this.populateCharts = function(widgetArr){
        widgetArr.forEach(function(widgetObj){
            var chartObj = widgetObj.chartObject;
            self.create(chartObj.id,chartObj.chartType,chartObj.xAxis,chartObj.yAxis,chartObj.groupType,chartObj.chartOptions)
        })
    }
    this.create = function(id, chartType, xAxis, yAxis, groupType,chartOptions) {
        var chartOptions = {}; //initialize for now to be empty, users will eventually submit this
    //Gets called after data load, accepts array of chartObjects
        var chartContainer = $('#widget-container-' + id + '> .box-content > .widget-content-container')[0];
        var chartWidth = chartContainer.offsetWidth;
        var chartHeight = chartContainer.offsetHeight;
        var chartRadius = chartWidth < chartHeight ? chartWidth / 2 : chartHeight / 2;
        //console.log(chartWidth, chartHeight, chartRadius);
        ///var all = ndx.groupAll()


        var chartObj; //Used for storing all chart options
        var xAxisIsNumber; //Checks if the xAxis is number, and if it needs to be linear or ordinal

        var dim = ndx.dimension(function(d) {
            if (parseInt(d[xAxis])) {
                d[xAxis] = Number(d[xAxis]);
                xAxisIsNumber = true; //Checks if xaxis is ordinal or linear
            };
            return d[xAxis];
        });

        if (groupType === "sum") {
            var grp = dim.group().reduceSum(function(d) {
                if (parseInt(d[yAxis])) d[yAxis] = Number(d[yAxis]);

                return Number(d[yAxis]);
            });
        } else if (groupType === "count") {
            var grp = dim.group().reduceCount(function(d) {
                if (parseInt(d[yAxis])) d[yAxis] = Number(d[yAxis]);

                return d[yAxis];
            });
        };

        // var grp = dim.group().reduceSum(function(d) {
        //     return d.HR;
        // })

        //var chart = dc[chartType](chartContainer);
        var chart = dc[chartType]('#widget-container-' + id + '> .box-content > .widget-content-container');

        //Add chart to Dictionary with a reference to the chart, and it's specific type (pie,bar,etc)
        //Is there a way to find out what kind of chart it is by checking the instance itself?
        charts['chart' + id] = {
            chart: chart,
            chartType: chartType,
            id: id,
            xAxis: xAxis,
            yAxis: yAxis,
            groupType: groupType,
            chartOptions: chartOptions
        };


        if (chartType === "pieChart") {

            chartObj = makePieChartObject(chartOptions);
            chartObj.radius = chartRadius;

        } else if (chartType === "barChart") {
            //margins prevents axes labels from being cutoff
            chartObj = makeBarChartObject(chartOptions, xAxis, yAxis, dim, grp, xAxisIsNumber);
            var size = dim.group().size();
            if (chartObj.gap * size >= chartWidth) {
                chartObj.gap = chartWidth * .5 / size;
            }
        } else if (chartType === "rowChart") {
            chartObj = makeRowChartObject(chartOptions, xAxis, yAxis, dim, grp, xAxisIsNumber);
            var size = dim.group().size();
            if(chartObj.gap*size >= chartHeight){
                chartObj.gap = chartHeight*.5/size;
            }
        };
        chartObj.width = chartWidth;
        chartObj.height = chartHeight;
        chartObj.dimension = dim;
        chartObj.group = grp;

        //passing in graphCount(i.e. the id) to keep functions expected input the same for both graph
        //creation and graph editing
        createChart(id, chartObj)
        return charts['chart' + id];
    };

    this.resize = function(id) {
        //http://plnkr.co/edit/kJDKH0?p=preview

        setTimeout(function() {
            //This setTimeout allows the graph to resize once the widget has
            //finished resizing to the set width
            //Alternatively can pass in the size of the widget in the function
            //then grab the gridster-desktop elements offsetWidth and height then
            //divide that by the passed in width and height.

            var chartContainer = $('#widget-container-' + id + '> .box-content > .widget-content-container')[0];
            var chartWidth = chartContainer.offsetWidth;
            var chartHeight = chartContainer.offsetHeight;
            var chartRadius = chartWidth < chartHeight ? chartWidth / 2 : chartHeight / 2;
            // var newWidth = document.getElementById('box-test').offsetWidth;
            // chart.width(newWidth)
            //   .transitionDuration(0);
            // pie.transitionDuration(0);
            // dc.renderAll();
            // chart.transitionDuration(750);
            // pie.transitionDuration(750);

            var chartObj = charts["chart" + id]

            if (!chartObj) return; //Short circuits if resizing empty widget

            var chart = chartObj.chart;

            if (chartObj.chartType === "pieChart") {
                chart
                    .radius(chartRadius * .8)
            } else if (chartObj.chartType === "barChart") {
                chart
                    .width(chartWidth * .8)
                    .height(chartHeight * .8)
            }

            dc.renderAll();
        }, 500)

    }

    //load data
    function loadData() {
        d3.csv('../data/baseballData.csv', function(data) {

            myData = data
            ndx = crossfilter(myData);
            //console.log("NDX:", data)
            //$scope.optionArray = Object.keys(data[0])
            //$scope.$apply()
        });
    };

    //for now init data here
    loadData();

    //Function that takes chartId and renders it with all options
    function createChart(id, chartOptions) {
        //Will be id instead of being hardcoded when switched to graph.service
        var chart = charts['chart' + id].chart;
        var keys = Object.keys(chartOptions);

        keys.forEach(function(key) {
            //console.log(key, ":", chartOptions[key])
            chart[key](chartOptions[key])
        });
        dc.renderAll();
    };
    //Pie Chart Option creator
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

    //Bar Chart Option creator-has superfluous parameters for testing
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

    //Row Chart Option creator-has superfluous parameters for testing
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
})

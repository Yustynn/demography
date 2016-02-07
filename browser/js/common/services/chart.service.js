app.service('ChartService', function (ChartUtilsService){
    var ndx, myData;   //public variables shared between all chart instances
    var chartDict = {}; //Object to store all instances of chartDict

    //public methods:

    //use to create a new chart instance
    this.create = function(chartConfig) {
        return new Chart(chartConfig);
    }

    //use to both resize and update config. For resize, size must be specified:
    this.update = function(chartConfig) {
        //find chart from chart dict and call _update method
    };

    //same as this.update
    this.resize = function(chartConfig) {
        if (chartConfig.chartSize) this.update(chartConfig);
    };

    //load data is called when a dashboard is initialized
    this.loadData = function(dataSet) {
        myData = dataSet;
        ndx = crossfilter(dataSet);
    };

    //Chart Constructor
    class Chart {
        constructor(chartConfig) {
            //default settings that every dc chart needs regardless of type:
            this.id = chartConfig.id;
            this.chartType = chartConfig.chartType;
            this.height = chartConfig.chartSize.height;
            this.width = chartConfig.chartSize.width;
            this.chartGroup = chartConfig.chartGroup || 'Group1';
            this.container = chartConfig.container;
            this.chart = dc[this.chartType](this.container,this.chartGroup);
            this._configureChart(chartConfig); //configure with chart specific properties and user settings such as colors
            debugger;   //check extended properties
            this._createChart();    //render the new chart
        };

        //attaches properties to the chart instance
        _configureChart(chartConfig) {
            angular.extend(this, ChartUtilsService.createChartOptions(chartConfig, ndx));
        };

        //check for 'on' key and apply. Then add to chartDict and dc.renderAll
        _createChart() {
            for (var key in this) {
                console.log(key);
                if(key === "on"){
                    this.chart[key].apply(null,this[key]) //not sure this still works. check table formatting to find out if this is the right syntax
                }
                else {
                    if (this.chart[key]) {//temporary fix to make sure if a chart is called with a function it can't take, it doesn't break anything
                        this.chart[key](this[key])
                    }
                }
            };

            chartDict[this.id] = this;   //add new chart to dict
            dc.renderAll(this.chartGroup);  //render all connected charts
            debugger;
        };
    };

});

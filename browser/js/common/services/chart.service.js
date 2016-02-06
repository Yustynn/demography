app.service('ChartService', function (ChartUtilsService){
    console.log("ChartService");
    var ndx, myData;   //public variables shared between all chart instances
    var chartDict = {}; //Object to store all instances of chartDict

    class Chart {
        constructor(id, chartConfig) {
            //default settings that every chart needs regardless of type:
            this.id = id;
            this.chartType = chartConfig.chartType;
            this.height = chartConfig.chartSize.height;
            this.width = chartConfig.chartSize.width;
            this.chartGroup = chartConfig.chartGroup || 'Group1';
            this.xAxisIsNumber; //TODO: move this into chart specific functionality
            this.dim = ndx.dimension(function(d) {
                if (parseInt(d[chartConfig.xAxis])) {
                    d[chartConfig.xAxis] = Number(d[chartConfig.xAxis]);
                    this.xAxisIsNumber = true; //Checks if xaxis is ordinal or linear
                };
                return d[chartConfig.xAxis];
            });
            this._configureChart();
            this._createChart();
        }

        //methods that are private start with _ for readability:

        //attaches properties to the chart instance
        _configureChart() {
            console.log('configuring chart');
            var configuredChart = ChartUtilsService.configureChart['barChart']();
        };

        //check for 'on' key and apply.
        _createChart() {
            for (var key in this) {
                if(key === "on"){
                    this[key].apply(null,this[key]) //not sure this still works. check table formatting to find out if this is the right syntax
                }
                // else {
                //     if (this[key]) {//temporary fix to make sure if a chart is called with a function it can't take, it doesn't break anything
                //         this[key](this.chartOptions[key])
                //     }
                // }
            };

            chartDict[this.id] = this;   //add new chart to dict
            dc.renderAll(this.chartGroup);
        };

        _updateChart(chartConfig) {
            if (this.chartType !== chartConfig.chartType)
            {
                //must completely reset chart type.
            }
        };
    };


    this.create = function(id, chartConfig) {
        var newChart = new Chart(id, chartConfig);
    }

    //use to both resize and update config. For resize, size must be specified:
    this.update = function(id, chartConfig) {
        //find chart from chart dict and call _update method
    };

    //same as this.update
    this.resize = function(id, chartConfig) {
        if (chartConfig.chartSize) this.update(id, chartConfig);
    }

    //load data is called when a dashboard is initialized
    this.loadData = function(dataSet) {
        myData = dataSet;
        ndx = crossfilter(dataSet);
    }
});


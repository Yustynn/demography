app.service('ChartUtilsService', function() {
    var _ndx;

    var chartDefaults = {
        barChart: {
            margins: {
                top: 5,
                left: 40,
                right: 10,
                bottom: 130
            },
            centerBar: false, //'boolean'
            x: d3.scale.ordinal(),
            xUnits: dc.units.ordinal,
            title: function(d) { //{ /*Default to both, give option for either*/ }
                return [d.key, d.value].join(' : ');
            },
            // yAxisLabel: c.yAxis, // 'value'
            // xAxisLabel: c.xAxis, //'value'
            elasticY: true, //'value'
            gap: 20,
            renderHorizontalGridLines: true,
            renderlet: function(chart) {
                chart.selectAll('g.x text')
                    .attr('transform', 'translate(-15,60) rotate(270)')
            }
        }
    }

    var configureBarChart = function(c){
        console.log('configuring bar chart')
        
        var barOptions = _overWriteDefaults(c,'barChart')
        
        let _currentDim = _createDimensionFromXAxisLabel(c,barOptions);
        
        barOptions.dimension = _currentDim;
        barOptions.group = _createGroup(c,_currentDim); //<--- UGLY
        barOptions.x = d3.scale.ordinal();
        barOptions.xUnits = dc.units.ordinal;
        
        barOptions = _configureXAxis(barOptions,_currentDim)
        delete barOptions.yAxis
        delete barOptions.xAxis //xAxis and yAxis will break bar chart 
        return barOptions;
    }

    var configurePieChart = function(c) {
        console.log('configuring pie chart');
        let currentDim = _createDimensionFromXAxisLabel(c)
        var pieObj = {
            dimension: currentDim,
            group: _createGroup(c,currentDim),
            radius: c.chartSize.width < c.chartSize.height ? c.chartSize.width / 2 : c.chartSize.height / 2,
            innerRadius: 0,
            slicesCap: 20,
            renderLabel: true,
            label: function(d) { //defaults to Key
                return d.key;
            },
            title: function(d) { //defaults to key : value
                return [d.key, d.value].join(' : ');
            }
        };
        return pieObj;
    };

    //REUSABLE HELPER METHODS:
    var _createGroup = function(c,_dim) {
        let grp;

        if (c.groupType === "sum") {
            grp = _dim.group().reduceSum(function(d) {
                if (parseInt(d[c.yAxis])) d[c.yAxis] = Number(d[c.yAxis]);

                return Number(d[c.yAxis]);
            });
        } else if (c.groupType === "count") {
            grp = _dim.group().reduceCount(function(d) {
                if (parseInt(d[c.yAxis])) d[c.yAxis] = Number(d[c.yAxis]);

                return d[c.yAxis];
            });
        }
        return grp;
    };

    var _createDimensionFromXAxisLabel = function(c,chartOptions) {
        let xAxisIsNumber = false;
        var _dim = _ndx.dimension(function(d) {
            if (parseInt(d[c.xAxis])) {
                d[c.xAxis] = Number(d[c.xAxis]);
                xAxisIsNumber = true;
            };
            return d[c.xAxis];
        });
        if(chartOptions) chartOptions.xAxisIsNumber = xAxisIsNumber;
        return _dim;
    };

    var _overWriteDefaults = function(c, chartType) {
        let _newConfigObj = chartDefaults[chartType]
        for (var key in c) {
            _newConfigObj[key] = c[key];
        }
        return _newConfigObj;
    }

    var _configureXAxis = function(chartOptions,_currentDim){
        if(chartOptions.xAxisIsNumber){
            
            var min = _currentDim.bottom(1)[0][chartOptions.xAxis];
            var max = _currentDim.top(1)[0][chartOptions.xAxis];
            chartOptions.x = d3.scale.linear().domain([min, max]);
            chartOptions.xUnits = dc.units.integers;
        }
        return chartOptions;
    }


    //PUBLIC METHODS:
    this.createChartOptions = function(config, ndx) {
        _ndx = ndx;
        if (config.chartType === 'barChart') return configureBarChart(config);
        if (config.chartType === 'pieChart') return configurePieChart(config);
    }
});

app.service('ChartUtilsService', function(){
    var _ndx, _dim, _xAxisIsNumber = false;

    var configureBarChart = function(c) {
        console.log('configuring bar chart');
        var barObj = {
            val: 'configured Bar Chart'
        };
        return barObj;
    };

    var configurePieChart = function(c) {
        console.log('configuring pie chart');
        _createDimensionFromXAxisLabel(c)
        var pieObj = {
            dimension: _dim,
            group: _createGroup(c),
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
    var _createGroup = function(c) {
        let grp;
        if (c.groupType === "sum") {
            grp = _dim.group().reduceSum(function(d) {
                if (parseInt(d[yAxis])) d[yAxis] = Number(d[yAxis]);

                return Number(d[yAxis]);
            });
        } else if (c.groupType === "count") {
            grp = _dim.group().reduceCount(function(d) {
                if (parseInt(d[yAxis])) d[yAxis] = Number(d[yAxis]);

                return d[yAxis];
            });
        }
        return grp;
    };

    var _createDimensionFromXAxisLabel = function(c) {
        _dim = _ndx.dimension(function(d) {
            if (parseInt(d[c.xAxis])) {
                d[c.xAxis] = Number(d[c.xAxis]);
                _xAxisIsNumber = true; //Checks if xaxis is ordinal or linear
            };
            return d[c.xAxis];
        });
    };

    //PUBLIC METHODS:
    this.createChartOptions = function(config, ndx) {
        _ndx = ndx;
        if (config.chartType === 'barChart') return configureBarChart(config);
        if (config.chartType === 'pieChart') return configurePieChart(config);
    }
});

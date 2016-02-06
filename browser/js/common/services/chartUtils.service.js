app.service('ChartUtilsService', function(){


    this.configureBarChart = function() {
        console.log('configuring bar chart');
        var barObj = {
            val: 'configured Bar Chart'
        };
        return barObj;
    };

    this.configurePieChart = function() {
        console.log('configuring pie chart');

        var pieObj = {
            val: 'configured Pie Chart'
        };
        return pieObj;
    };

    this.configureChart = {
        'barChart' : this.configureBarChart,
        'pieChart' : this.configurePieChart
    };
});

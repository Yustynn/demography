app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope) {
    $scope.test = function(options) {

        var hitslineChart = dc.lineChart("#chart-line-hitsperday");

        var data = [{
            date: "12/27/2012",
            http_404: 2,
            http_200: 190,
            http_302: 100
        }, {
            date: "12/28/2012",
            http_404: 2,
            http_200: 10,
            http_302: 100
        }, {
            date: "12/29/2012",
            http_404: 1,
            http_200: 300,
            http_302: 200
        }, {
            date: "12/30/2012",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "12/31/2012",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/01/2013",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/02/2013",
            http_404: 1,
            http_200: 10,
            http_302: 1
        }, {
            date: "01/03/2013",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/04/2013",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/05/2013",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/06/2013",
            http_404: 2,
            http_200: 200,
            http_302: 1
        }, {
            date: "01/07/2013",
            http_404: 1,
            http_200: 200,
            http_302: 100
        }];
        var ndx = crossfilter(data);
        var parseDate = d3.time.format("%m/%d/%Y").parse;
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.total = d.http_404 + d.http_200 + d.http_302;
            d.Year = d.date.getFullYear();
        });

        var dateDim = ndx.dimension(function(d) {
            return d.date;
        });
        var hits = dateDim.group().reduceSum(function(d) {
            return d.total;
        });
        var minDate = dateDim.bottom(1)[0].date;
        var maxDate = dateDim.top(1)[0].date;

        hitslineChart
            .width(500).height(200)
            .dimension(dateDim)
            .group(hits)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .brushOn(true)
            .yAxisLabel("Hits per day");

        var yearRingChart = dc.pieChart("#chart-ring-year");
        var yearDim = ndx.dimension(function(d) {
            return +d.Year;
        });
        var year_total = yearDim.group().reduceSum(function(d) {
            return d.http_200 + d.http_302;
        });

        yearRingChart
            .width(150).height(150)
            .dimension(yearDim)
            .group(year_total)
            .innerRadius(30);

        dc.renderAll();


        //     var margin = {
        //             top: 40,
        //             right: 20,
        //             bottom: 30,
        //             left: 40
        //         },
        //         width = 960 - margin.left - margin.right,
        //         height = 500 - margin.top - margin.bottom;

        //     var formatPercent = d3.format(".0%");

        //     var x = d3.scale.ordinal()
        //         .rangeRoundBands([0, width], .1);

        //     var y = d3.scale.linear()
        //         .range([height, 0]);

        //     var xAxis = d3.svg.axis()
        //         .scale(x)
        //         .orient("bottom");

        //     var yAxis = d3.svg.axis()
        //         .scale(y)
        //         .orient("left")
        //         .tickFormat(formatPercent);

        //     var tip = d3.tip()
        //         .attr('class', 'd3-tip')
        //         .offset([-10, 0])
        //         .html(function(d) {
        //             return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
        //         })

        //     var svg = d3.select("body").append("svg")
        //         .attr("width", width + margin.left + margin.right)
        //         .attr("height", height + margin.top + margin.bottom)
        //         .append("g")
        //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //     d3.csv("data.tsv", type, function(error, data) {
        //         x.domain(data.map(function(d) {
        //             return d.letter;
        //         }));
        //         y.domain([0, d3.max(data, function(d) {
        //             return d.frequency;
        //         })]);

        //         svg.append("g")
        //             .attr("class", "x axis")
        //             .attr("transform", "translate(0," + height + ")")
        //             .call(xAxis);

        //         svg.append("g")
        //             .attr("class", "y axis")
        //             .call(yAxis)
        //             .append("text")
        //             .attr("transform", "rotate(-90)")
        //             .attr("y", 6)
        //             .attr("dy", ".71em")
        //             .style("text-anchor", "end")
        //             .text("Frequency");

        //         svg.selectAll(".bar")
        //             .data(data)
        //             .enter().append("rect")
        //             .attr("class", "bar")
        //             .attr("x", function(d) {
        //                 return x(d.letter);
        //             })
        //             .attr("width", x.rangeBand())
        //             .attr("y", function(d) {
        //                 return y(d.frequency);
        //             })
        //             .attr("height", function(d) {
        //                 return height - y(d.frequency);
        //             })


        //     });

        //     function type(d) {
        //         d.frequency = +d.frequency;
        //         return d;
        //     }



    }


})

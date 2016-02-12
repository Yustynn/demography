app.service('TimeService', function() {
        //Will handle making time scales, time and ordinal
        var _ndx, _dataSet;
        //Parse time based on several different possible formats
        //If ordinal, needs to loop through the data and 
        //parse either Day,Week,Month,Year,etc
        //If Linear, set min and max
        //sets dimension, scale(x,xunit)

        const monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            // daysShort = ["Sun", "Mon", "Tues", "Wed", "Thr", "Fri", "Sat"],
            timeFormats = {
                a: "%m-%d-%Y",
                b: "%Y-%m-%d",
                c: "%d-%m-%Y"
            },
            seasons = {
                Winter: ["0", "1", "2"],
                Spring: ["3", "4", "5"],
                Summer: ["6", "7", "8"],
                Fall: ["9", "10", "11"]
            },
            timeUnitFunction = {
                Day: function(time) {
                    return time.getDay()
                },
                Month: function(time) {
                    return time.getMonth()
                },
                Year: function(time) {
                    return time.getFullYear()
                },
                Season: function(time) {
                    let month = time.getMonth();

                    for (let key in seasons) {
                        if (season[key].indexOf(month) > -1) return key;
                    }
                }
            }


		this.loadData = function(dataset, ndx) {
		    _ndx = ndx;
		    _dataSet = dataset;
		}

		this.create = function(timeOptions,xAxis){
			return new TimeFormat(timeOptions,xAxis)
		}

        class TimeFormat {

            constructor(timeOptions,xAxis) {
                    this.xAxis = xAxis;
                    this.timeUnit = timeOptions.timeUnit;
                    this.format = _setDateFormat(timeOptions.dateFormatType);
                    this._configureData(this.xAxis);
                }
            
                //Parses the time and also adds a property to the row [i.e. Day, month, Year, Season, etc]
            _configureData(xAxis) {
                _dataSet.forEach(function(d) {
                    let c = d[xAxis]
                    c = this.format.parse(c);
                    if (this.timeUnit) {
                        let func = timeUnitFunction[this.timeUnit]
                        d[this.timeUnit] = func(c);
                    }
                })
            }

            _configureScale(chartOptions, scaleType) {
                let c = chartOptions;
                if (scaleType === "ordinal") {
                    c.x = d3.scale.ordinal();
                    c.xUnits = d3.units.ordinal;
                    c.xAxis().tickFormat = function(d) {
                        return d;
                    }
                } else {
                    c.x = d3.time.scale().domain([d3.min(_dataSet, function(d) {
                            return d[c.xAxis]
                        }), d3.max(_dataSet, function(d) {
                            return d[c.xAxis]
                        })])
                }
                return c;
            }

            _configureDimension (timeUnit) {
                var _dim;
                if (timeUnit) {
                    _dim = _ndx.dimension(function(d) {
                        return d[timeUnit];
                    })
                } else {
                    _dim = _ndx.dimension(function(d) {
                        return d[this.xAxis];
                    })
                }

                return _dim;
            }
        }
	//Creates the date formatting function based on user input
    function _setDateFormat(dateFormatType) {
            return d3.time.format(timeFormats[dateFormatType]);
     	}

})


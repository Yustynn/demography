app.directive('widgetView', function (WidgetFactory, $uibModal, DatasetFactory, GraphService, ChartService, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/widget/widget.html',
        scope: {
            widget: '=',
            dataset: '=',
            dashboard: '='
        },
        link: function (scope, element, attrs) {
            var grid = $('.gridster')[0];
            var gridWidth = grid.offsetWidth;
            //Temporary size stuff
            var graphSize = {
                width: gridWidth/scope.widget.sizeX,
                height: gridWidth/scope.widget.sizeY
            }

            var c = scope.widget.chartObject;
            if (c && c.chart) {

                var chartConstructor = {
                    id: c.id,
                    container: $(element).find('.widget-content-container')[0],
                    chartType: c.chartType,
                    chartGroup: c.chartGroup,
                    xAxis: c.xAxis,
                    yAxis: c.yAxis,
                    groupType: c.groupType,
                    colorSettings: c.colorSettings,
                    width: graphSize.width,
                    height: graphSize.height
                };

                ChartService.create(chartConstructor);
                //GraphService.create($(element).find('.widget-content-container')[0], c.id, c.chartType, c.xAxis, c.yAxis, c.groupType, c.chartOptions,graphSize,c.chartGroup,c.colorSettings);
            }
            scope.remove = function (widget) {
                if(widget._id) WidgetFactory.delete(widget._id);
                scope.dashboard.widgets.splice(scope.dashboard.widgets.indexOf(widget), 1);
            };

            scope.createDatacountWidget = function(widget, datasetId) {

                //set title
                widget.title = "Statistics";
                widget.sizeX = 4;
                widget.sizeY = 1;
                graphSize = {
                    width: gridWidth/widget.sizeX,
                    height: gridWidth/widget.sizeY
                }
                //set width and height
console.error('NEED TO IMPLEMENT DATACOUNTWIDGET LATER');
                // var chartObj = GraphService.create($(element).find('.widget-content-container')[0],widget.id,'dataCount',null,null,null,null,graphSize);
                // widget.chartObject = chartObj;
                // WidgetFactory.update(widget);
            }

            scope.element = element;

            scope.openSettings = function (widget, datasetId, graphTypeToCreate) {
                $uibModal.open({
                    scope: scope,
                    templateUrl: 'js/widget/widget.settings.html',
                    controller: 'WidgetSettingsCtrl',
                    resolve: {
                        widget: function() {
                            return widget;
                        },
                        graphTypeToCreate: function() {
                            return graphTypeToCreate || null;
                        },
                        dataset: function() {
                            return DatasetFactory.fetchOne(datasetId);
                        },
                        element: function(){
                            return $(element).find('.widget-content-container')[0]
                        },
                        graphSize: function(){
                            return graphSize;
                        }
                    }
                });
            };

            //used to ng-hide new-widget-selector
            scope.noGraph = function (widget){
                return widget.chartObject && widget.chartObject!={};
            };

            scope.$watch('widget', function(){
                console.log("changed");

                graphSize = {
                    width: gridWidth/scope.widget.sizeX,
                    height: gridWidth/scope.widget.sizeY
                }

                //console.log(scope.widget);

                ChartService.resize({id: scope.widget.id, width: graphSize.width, height: graphSize.height});
                var updatedWidget = {
                    col: scope.widget.col,
                    row: scope.widget.row,
                    sizeX: scope.widget.sizeX,
                    sizeY: scope.widget.sizeY,
                    _id: scope.widget._id
                };
                WidgetFactory.update(updatedWidget);    //no ().then necessary here

              }, true);
        }
    };
});

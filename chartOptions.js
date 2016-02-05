 var optionsForXY = {
     width: fromContainer,
     height: fromContainer,
     margins: {
         top: 5,
         left: 10,
         right: 10,
         bottom: 20
     },
     title: { /*Default to both, give option for either*/ } || function(d) {
         return [d.key, d.value].join(' : ');
     },
     brushOn: 'boolean' || true,
     centerBar: 'boolean' || true,
     yAxisLabel: 'value' || y.title,
     xAxisLabel: 'value' || x.title,
     elasticX: 'value' || true,
     elasticY: 'value' || true,
     x: [d3.scale.linear()||d3.scale.ordinal()].[domain()], //Should automatically find the best fit for this?
     //if linear then domain needs to be specified? Outside of options, in function
     gap: 'value' || 20,
     renderHorizontalGridLines: 'value' || true
 }

 var optionsForPie = {
     width: fromContainer,
     height: fromContainer,
     radius: width > height ? height / 2 : width / 2,
     innerRadius: 'val' || 0,
     slicesCap: 'val' || 20,
     renderLabel: 'val' || true,
     label: { /* give option for all caps,key,value etc */ } || function(d){return d.key},
     title: { /*Default to both, give option for either*/ } || function(d) {
         return [d.key, d.value].join(' : ');
     }
 }


 //all get dimension and group.  Will be passed in from function
 // i.e. function(id, dimension,group,chartOptionsObj)

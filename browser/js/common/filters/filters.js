app.filter('arrayToString', function (){
    return function (array) {
        //for now just output array as CSV
        return array.toString();
    }
});

app.filter('capitalize', function (){
     return function (str) {
      var reg = /([^\W_]+[^\s-]*) */g;
      return (!!str) ? str.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
    }
});

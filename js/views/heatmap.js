$(function(){

	if (cache['m'] != undefined) { cache['m'].remove(); } 
		cache['m'] = L.map('map').setView([0, 38],6);
		//cache['m'].fitWorld(); //.zoomIn(), {renderer: L.canvas()} 

	/*
    L.esri.tiledMapLayer({
			url: "https://unepliveservices.unep.org/arcgis/rest/services/UNBASEMAP_FINAL/MapServer", 
			minZoom:2,
			attribution: 'Imagery &copy; United Nations Basemap | Geocoding by ESRI'
	}).addTo( cache['m'] );

    */

    L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
    }).addTo( cache['m'] );

    $.get( "data/stations-ke.json", function() {
	})
	.done(function(resp) {

		processResp(resp);

	})
	.fail(function() {
	})
	.always(function() {
		
	});

});


function processResp(resp)
{
   var x = 0; var m = 0;
   
   var stations    = [];
   var stationsStr = '';

   $.each(resp, function (index, value) {

       if (x % 20 == 0)
       {
           stationsStr = stationsStr.replace(/,\s*$/, "");
           stations[m] = stationsStr ;
           m++;
           stationsStr = '';
       }

       stationsStr += value.id +',';
       x++;

   });

   $.each(stations, function (index, value) {
   
      //console.log(value);
      var apiUrl = 'http://api.openweathermap.org/data/2.5/group?id='+ value + '&appid=c9d44c46ffef0a48cfce729c76e4f168';
      //console.log(apiUrl);
      var points = [];

       $.get( apiUrl , function() {
       })
       .done(function(resp) {

          //console.log(resp.list);

          $.each(resp.list, function (index, value) {
             // console.log(value);
            points.push( [value.coord.lat, value.coord.lon, value.main.temp*7 ] );

          });


           var heat = L.heatLayer(points, {radius: 25}).addTo( cache['m'] );
            

        })
        .fail(function() {
        })
        .always(function() {
            
        });
       
       });

   

   


    

}
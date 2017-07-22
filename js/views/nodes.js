$(function(){

	if (cache['m'] != undefined) { cache['m'].remove(); } 
		cache['m'] = L.map('map').setView([0, 38],6);
		//cache['m'].fitWorld(); //.zoomIn(), {renderer: L.canvas()} 

	L.esri.tiledMapLayer({
			url: "https://unepliveservices.unep.org/arcgis/rest/services/UNBASEMAP_FINAL/MapServer", 
			minZoom:2,
			attribution: 'Imagery &copy; United Nations Basemap | Geocoding by ESRI'
	}).addTo( cache['m'] );

    $.get( "data/stations-ke.json", function() {
	})
	.done(function(resp) {

		var latLon; var html; 

		$.each(resp, function (index, value) {

		 latLon = [ value.coord.lat, value.coord.lon ];
		 //html = $('<p>').data('id', value.id).html( value.name );
		 html = '<p data-id="' + value.id + '">' + value.name + '</p>';



		  
          addStation( latLon , html );

		});
	})
	.fail(function() {
	})
	.always(function() {
		
	});
	
	
    




});

function addStation(latLon, html)
{
	L.marker(latLon).addTo( cache['m'] )
    .bindPopup(html);

}
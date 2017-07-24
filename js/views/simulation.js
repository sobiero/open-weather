var socket =[] , timer = [], markers = [];

$(function(){

    var inactiveMarker = L.AwesomeMarkers.icon({
        icon: 'spinner',
        markerColor: 'red',
        prefix: 'fa',
        spin:true
      });
	
    var activeMarker = L.AwesomeMarkers.icon({
        icon: 'thermometer-quarter',
        markerColor: 'green',
        prefix: 'fa'
      });


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



    $.get( "data/stations-sim-ke.json", function() {
	})
	.done(function(resp) {

		//var latLon; var html; var markerToUse; 

		//$.each(resp, function (index, value) {

		 //latLon = [ value.coord.lat, value.coord.lon ];
		 //html = $('<p>').data('id', value.id).html( value.name );
		 //html = '<p data-id="' + value.id + '">' + value.name + '</p>';

         // addStation( latLon , html, activeMarker );

		//});


        window.setInterval(function() { updateStation(resp[0], activeMarker, inactiveMarker) }, 2000);

        cache['stations'] = resp[0];



	})
	.fail(function() {
	})
	.always(function() {
		
	});
	

});

function updateStation(resp, activeMarker, inactiveMarker)
{
  $.each(resp, function (index, value) {

         var haschanged = $('#map').data('server-' + value.port + '-haschanged');

         //console.log( value.port );
         //console.log( haschanged );
         //console.log( '' );

         //if (haschanged === true)
         //{
         
             var serverStatus = $('#map').data('server-' + value.port );

             var markerIcon = serverStatus == 'on' ? activeMarker : inactiveMarker ;

             latLon = [ value.coord.lat, value.coord.lon ];
             html = $('<p>').data('id', value.id).html( value.name );
             html = '<p data-id="' + value.id + '">' + value.name + '</p>';

             addStation( latLon , html, markerIcon, value.port );

        // }

  });
  
}

function addStation(latLon, html, markerIcon, serverPort)
{
    if (markers[ serverPort ] != undefined) { cache['m'].removeLayer( markers[ serverPort ] ); }
    
    markers[ serverPort ] = L.marker(latLon, {icon: markerIcon }).on('click', function(){ openServer(serverPort)} );
    cache['m'].addLayer( markers[ serverPort ] );

    markers[ serverPort ].bindPopup(html);

}

function openServer( serverPort )
{
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    if (cache['chart1'] != undefined) { cache['chart1'].destroy(); } 

    cache['chart1'] = new Highcharts.chart('chart1', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];

                    socket[serverPort].on('weather', function(data) {
        
                        console.log(data.name + ' ' + data.time + ' - ' + data.main.temp);
                        
                        var x = data.time, // current time
                            y = data.main.temp;
                        
                        series.addPoint([x, y], true, true);
                        
                    });
                    
                    
                    /*
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                    }, 1000);*/
                }
            }
        },
        title: {
            text: cache['stations'][serverPort].name
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Temperature (°C)',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: null //Math.random()
                    });
                }
                return data; 
            }())
        }]
    });

}


function connect(serverPort) {
   
    //console.log('connecting to ' + serverPort);
   
    var tmp = $('#map').data('server-' + serverPort);
    //console.log(serverPort + ' '+ tmp);
    var haschanged = (tmp == undefined || tmp == 'on') ? true : false;
    //console.log(haschanged);


    $('#map').data('server-' + serverPort , 'off')
             .data('server-' + serverPort + '-haschanged', haschanged);;
    
    socket[serverPort] = io.connect("http://web.local.net:" + serverPort ),

    socket[serverPort].on('error', function() {
        // wait 2 seconds then try again
        if (!socket.socket.connected) {
            timer[serverPort] = window.setInterval(function() { connect() }, 2000);
        }
    });

    socket[serverPort].on('disconnect', function() {
        var tmp = $('#map').data('server-' + serverPort);
        var haschanged = tmp == 'on' ? true : false;
        $('#map').data('server-' + serverPort , 'off')
                 .data('server-' + serverPort + '-haschanged', haschanged);;
    });


    socket[serverPort].on('connect', function() {
        window.clearInterval(timer[serverPort]);
        //console.log('connected to ' + serverPort );
        var tmp = $('#map').data('server-' + serverPort);

        var haschanged = tmp == 'on' ? false : true;
        $('#map').data('server-' + serverPort , 'on')
                 .data('server-' + serverPort + '-haschanged', haschanged);
        
    });

    socket[serverPort].on('weather', function(data) {
        
        //console.log(data);
        
    });



}

connect(8181);
connect(8182);
connect(8183);
connect(8184);

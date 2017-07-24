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

		var latLon; var html; 

		$.each(resp, function (index, value) {

		 latLon = [ value.coord.lat, value.coord.lon ];
		 //html = $('<p>').data('id', value.id).html( value.name );
		 html = '<p><a class="station" href="javascript:void(0)" data-id="' + value.id + '">' + value.name + '</a></p>';

          addStation( latLon , html );

		});
	})
	.fail(function() {
	})
	.always(function() {
		
	});


    $(document).on('click', '.station', function(){
        var stationId = $(this).data('id');

        
        getDataAndChart(stationId);
        
        
        
    
    });
	

});

function getDataAndChart(stationId)
{
    var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?id='+ stationId + '&units=metric&appid=c9d44c46ffef0a48cfce729c76e4f168';

    //console.log( url );

    $.get( url , function() {
	})
	.done(function(resp) {
      chartData(resp);
	})
	.fail(function() {})
	.always(function() {});

}

function chartData(data)
{

    var iconPath = 'http://openweathermap.org/img/w/';

    
    var todayTemp  = data.list[0].temp.max;
    var todayIcon  = data.list[0].weather[0].icon;
    var todayMain  = data.list[0].weather[0].main;
    var todayDesc  = data.list[0].weather[0].description;

    console.log(todayDesc);

    var html = ' <img style="margin-left:86px;" src="'+ iconPath + todayIcon +'.png" alt="'+ todayDesc +'" title="'+ todayDesc +'" /> ';
        html += todayTemp + '°C';

    $('#stations-data .today-weather').empty().html( html );
    
    

    serverData = [];
    var date, time;

    stationName = data.city.name ;

    $.each(data.list, function (index, value) {
        date = new Date( value.dt * 1000 );
        time = date.getTime();
        
        serverData.push([time, value.temp.max]);

	});


    
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    if (cache['chart2'] != undefined) { cache['chart2'].destroy(); } 

    cache['chart2'] = new Highcharts.chart('chart2', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {



                }
            }
        },
        title: {
            text: stationName
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
            data: /* (function () {
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
            }()) */

            serverData

        }]
    });
    
    
    
    
    $('#stations-data').modal({
          backdrop: false,
              show:true
    });

}


function addStation(latLon, html)
{
	L.marker(latLon).addTo( cache['m'] )
    .bindPopup(html);

}
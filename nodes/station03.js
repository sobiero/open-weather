var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  
  setInterval(function(){
        sendWeather(client);
    }, 2000);
  
  client.on('event', function(data){});
  client.on('disconnect', function(){});

});
server.listen(8183, "0.0.0.0");


function sendWeather(client){
    var time = new Date();
    client.emit('weather', { 
            id:    1003,
            name: 'Simulated Station 3 - Kitui',
            coord: {
              lon: 38.010559,
              lat: -1.36696
            },
            //time: pad(time.getHours(), 2) + ":" + pad(time.getMinutes(),2) + ":" + pad(time.getSeconds(), 2),
            time: (new Date()).getTime(),
            main: {
               temp: Math.round(getRandomArbitrary(29,35) *100)/100,
               pressure: Math.floor(getRandomArbitrary(785,1000)),
               humidity: Math.round(getRandomArbitrary(10,25) *100)/100,              
            },
            wind: {
              speed: Math.floor(getRandomArbitrary(5,10)),
              deg: Math.floor(getRandomArbitrary(120,180))
            }
    });
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
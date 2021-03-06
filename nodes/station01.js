var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  
  setInterval(function(){
        sendWeather(client);
    }, 2000);
  
  client.on('event', function(data){});
  client.on('disconnect', function(){});

});
server.listen(8181, "0.0.0.0");


function sendWeather(client){
    var time = new Date();
    client.emit('weather', { 
            id:    1001,
            name: 'Simulated Station 1 - Kisumu',
            coord: {
              lon: 34.761711,
              lat: -0.10221
            },
            //time: pad(time.getHours(), 2) + ":" + pad(time.getMinutes(),2) + ":" + pad(time.getSeconds(), 2),
            time: (new Date()).getTime(),
            main: {
               temp: Math.round(getRandomArbitrary(25,30) *100)/100,
               pressure: Math.floor(getRandomArbitrary(800,900)),
               humidity: Math.floor(getRandomArbitrary(25,55)),              
            },
            wind: {
              speed: Math.floor(getRandomArbitrary(1,5)),
              deg: Math.floor(getRandomArbitrary(220,240))
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
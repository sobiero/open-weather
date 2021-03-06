var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  
  setInterval(function(){
        sendWeather(client);
    }, 2000);
  
  client.on('event', function(data){});
  client.on('disconnect', function(){});

});
server.listen(8182, "0.0.0.0");


function sendWeather(client){
    var time = new Date();
    client.emit('weather', { 
            id:    1002,
            name: 'Simulated Station 2 - Rongai',
            coord: {
              lon: 35.863819,
              lat: -0.17333
            },
            //time: pad(time.getHours(), 2) + ":" + pad(time.getMinutes(),2) + ":" + pad(time.getSeconds(), 2),
            time: (new Date()).getTime(),
            main: {
               temp: Math.round(getRandomArbitrary(14,19) *100)/100,
               pressure: Math.floor(getRandomArbitrary(800,900)),
               humidity: Math.round(getRandomArbitrary(25,55) *100)/100,              
            },
            wind: {
              speed: Math.floor(getRandomArbitrary(5,10)),
              deg: Math.floor(getRandomArbitrary(60,180))
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
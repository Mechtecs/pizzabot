var restify = require('restify');
var builder = require('botbuilder');
var http = require('superagent');
var recast = require('recastai')

// init Microsoft bot connector
var bot = new builder.BotConnectorBot({ appId: process.env.BOTCONNECTOR_APPID, appSecret: process.env.BOTCONNECTOR_APPSECRET });
// process.env.BOTCONNECTOR_APPID

// Require all my intents file
var Iorder_food = require('./modules/order_food');
var Itopping = require('./modules/topping');
var Isize = require('./modules/size');
var Ilocation = require('./modules/location');
var Itime = require('./modules/time');

var INTENTS = {
  order_food: Iorder_food,
  topping: Itopping,
  size: Isize,
  location: Ilocation,
  time: Itime,
}
var CLIENT = new recast.Client(process.env.RECAST_REQUESTTOKEN);
// Create bot and add dialogs
bot.add('/', function (session) {

  var input = session.message.text.toString().replace(/\0/g, '');

  CLIENT.textRequest(input, function (res, err) {
    if (err) {
      session.send('Das habe ich nicht verstanden.');
    } else {
      var intent = res.intent();

      if (intent && INTENTS[intent]) {
        INTENTS[intent](res)
          .then(function (res) { session.send(res) })
          .catch(function (res) { session.send(res) });
      } else {
        session.send('Entschuldigung, ich konnte nicht verstehen, was Sie von mir wollen. Können Sie es erneut versuchen?');
      }
    }
  })
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
server.listen(server_port, server_host, function() {
  console.log('%s listening to %s', server_host, server_port);
});

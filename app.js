var restify = require('restify');
var builder = require('botbuilder');
var http = require('superagent');
var recast = require('recastai')

// init Microsoft bot connector.catch
var bot = new builder.BotConnectorBot({ appId: process.env.BOTCONNECTOR_APPID, appSecret: process.env.BOTCONNECTOR_SECRET });
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
      session.send('I have a headache ...');
    } else {
      var intent = res.intent();
      console.log(intent);
      if (intent == 'order_food') {
        Iorder_food(res)
          .then(function (res) {
            session.send(res, 'de');
            session.beginDialog('/pizza/size');
          })
          .catch(function (res) { session.send(res) });
      } else {
        session.send('I could not understand you. Do you want to order pizza?');
      }
    }
  })
});

bot.add('/pizza/topping', function (session) {

  var input = session.message.text.toString().replace(/\0/g, '');

  CLIENT.textRequest(input, function (res, err) {
    if (err) {
      session.send('I have a headache ...');
    } else {
      var intent = res.intent();

      if (intent == 'topping') {
        Itopping(res, session)
          .then(function (res) {
            session.send(res);
           })
          .catch(function (res) { session.send(res) });
      } else {
        session.send('I could not understand you. What do you want on your pizza?');
      }
    }
  })
});
bot.add('/pizza/size', function (session) {

  var input = session.message.text.toString().replace(/\0/g, '');

  CLIENT.textRequest(input, function (res, err) {
    if (err) {
      session.send('I have a headache ...');
    } else {
      var intent = res.intent();

      if (intent == 'size') {
        Isize(res, session)
          .then(function (res) {
            console.log("got the size");
            session.send(res);
            session.beginDialog('/pizza/topping');
          })
          .catch(function (res) { session.send(res) });
      } else {
        session.send('I could not understand you. We offer 22 cm, 26 cm and 38 cm big pizzas?');
      }
    }
  })
});
bot.add('/pizza/location', function (session) {

  var input = session.message.text.toString().replace(/\0/g, '');

  CLIENT.textRequest(input, function (res, err) {
    if (err) {
      session.send('I have a headache ...');
    } else {
      var intent = res.intent();

      if (intent && INTENTS[intent]) {
        INTENTS[intent](res)
          .then(function (res) { session.send(res) })
          .catch(function (res) { session.send(res) });
      } else {
        session.send('I could not understand you. Where do you live?');
      }
    }
  })
});
bot.add('/pizza/time', function (session) {

  var input = session.message.text.toString().replace(/\0/g, '');

  CLIENT.textRequest(input, function (res, err) {
    if (err) {
      session.send('I have a headache ...');
    } else {
      var intent = res.intent();

      if (intent && INTENTS[intent]) {
        INTENTS[intent](res)
          .then(function (res) { session.send(res) })
          .catch(function (res) { session.send(res) });
      } else {
        session.send('I could not understand you. When should we deliver it?');
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

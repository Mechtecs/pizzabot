function order_food(response) {
    var location = null;
    var datetime = null;
    var duration = null;

    result = response.sentence();
    location = response.get('location');

    if (location) {
      return new Promise(function (resolve, reject) {
          resolve('Sie wollen eine Waffenbesitzkarte in ' + location.raw + ' beantragen. Sekunde, ich schaue nach der zuständigen Stelle.');
      });
    } else {
      return new Promise(function (resolve, reject) {
          reject('Entschuldigung, mir fehlt der Ort zu Ihrer Frage, um eine eindeutige Zuständigkeit ermitteln zu können!');
      });
    }
}

module.exports = order_food;

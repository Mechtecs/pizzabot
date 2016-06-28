function topping(response, ses) {

    var topping = null;

    result = response.sentence();
    topping = response.get('topping');
    console.log(topping.raw);
    if (topping) {
      return new Promise(function (resolve, reject) {
          resolve('Sie wollen eine Waffenbesitzkarte in ' + location.raw + ' beantragen. Sekunde, ich schaue nach der zuständigen Stelle.');
      });
    } else {
      return new Promise(function (resolve, reject) {
          reject('Entschuldigung, mir fehlt der Ort zu Ihrer Frage, um eine eindeutige Zuständigkeit ermitteln zu können!');
      });
    }
}

module.exports = topping;

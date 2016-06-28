function size(response, ses) {

    result = response.sentence();
    size = response.get('size');

    if (size && (size.raw == '22 cm' || size.raw == '26 cm' || size.raw == '38 cm')) {
      return new Promise(function (resolve, reject) {
        ses.userData.size = size.raw;
        resolve('Ok your pizza will be ' + size.raw + ' wide. What do you want on your pizza? Like salami or cheese.')
      });
    } else {
      return new Promise(function (resolve, reject) {
          reject('We dont offer that! Please choose between 22, 26 and 38 cm!');
      });
    }

}

module.exports = size;

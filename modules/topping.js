function topping(response, ses) {

    var topping = null;

    result = response.sentence();
    topping = response.all('topping');
    toppings = " ";

    for(var i = 0; i < topping.length; i++){
      if(i == 0)
        toppings += topping[i].raw;
      else
        toppings += ", "+topping[i].raw;
    }

    ses.userData.toppings = toppings;

    if (topping) {
      return new Promise(function (resolve, reject) {
          resolve('Ok, we will put the following toppings on your pizza: ' + toppings);
      });
    } else {
      return new Promise(function (resolve, reject) {
          reject('Sorry, but we dont offer that!');
      });
    }
}

module.exports = topping;

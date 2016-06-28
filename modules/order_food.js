function order_food(response) {
    return new Promise(function (resolve, reject) {
        resolve('What size do you want? We offer 22 cm, 26 cm and 38 cm big pizzas.');
    });
}

module.exports = order_food;

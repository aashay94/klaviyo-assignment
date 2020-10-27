const gettingOrdersFromShopify = require('./utils/shopify');
const placedOrder = require('./models/placed_order');
const orderedProduct = require('./models/ordered_product');
const getLogger = require('./utils/logger');
const cron = require('node-cron');


/* In the date variable I'm taking the current time, because that is created_at_max,
we get all orders before this day and time
*/
var date = new Date().toISOString().slice(0, 19);

/*
gettingOrdersFromShopify method is an async function, which retrieves
the order list from Shopify inside a try/catch block.
If an error is caught and thrown I use a logger which creates a new file
and saves any errors there.
At the end of `orderedProductsFromShopfiy` method I throw an error which stop the script from running. 
This is to prevent any calls being made to Klaviyo if I am unable
to retrieve the order list from Shopify
*/

const orderedProductsFromShopfiy = gettingOrdersFromShopify(date)
  .catch((error) => {
    getLogger().error('error:', error);
    throw new Error('Unable to grab orders from Shopify');
  });


  /*
    Using cron jobs to update the getch order every 30 minutes.
    It was not working correctly. Hence, commenting out. 
  */
 
// cron.schedule('30 * * * *', function (data) {

//   var date1 = new Date();
//   date1.setMinutes(date1.getMinutes() - 30);
//   var newTimestamp = date1.toISOString().slice(0, 19);
//   console.log("Calling and updating it every 30 minutes" + data);
//   gettingOrdersFromShopify(newTimestamp);
//   pushOrderToKlayivo();

//   orderedProductsFromShopfiy();
// });


/*
pushOrderToKlaviyo function runs two functions that are required. 
The first one pushes orderedProducts while the second one pushes the placedOrder.
*/

const pushOrderToKlayivo = (order) => {
  orderedProduct(order);
  placedOrder(order);
};

/*
Running a forEach loop on each order object and push it to Klaviyo
*/

orderedProductsFromShopfiy.then((orders) => {
  //console.log(orders); // checking on console whether I'm getting the orders or not
  orders.forEach((order) => pushOrderToKlayivo(order));
});


const Shopify = require('shopify-api-node');
/* I'm making use of shopify-api-node module. 
*/
const shopName = process.env.SHOP_NAME;
const apiKey = process.env.API_KEY;
const password = process.env.PASSWORD;
/*
I'm passing in an object with the shopName, apiKey and the password. They have been defined inside
the config file. 
*/
const shopify = new Shopify({shopName,apiKey,password,});

const gettingOrdersFromShopify = async (created_at_max) => { 
  /*here created_at_max is the current time, we are getting 
    all the orders before that time
  */
  try {
    /*
    Once the shopify object is ready, I run an async/await function to grab the order list with created_at_max
    as the parameter.
    */
    return await shopify.order.list({created_at_max});
  } catch (error) {
    /*
    If something goes wrong, I throw an error which is then handled inside the index.js file and logged appropriately.
    */
    throw new Error("Error caught"+error);
  }
};


module.exports = gettingOrdersFromShopify;

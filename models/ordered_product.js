const pushDataToKlaviyo = require('../utils/klaviyo');
const getLogger = require('../utils/logger');

/*
Since ordered_products may run multiple times for each order (depending on the number of line items), 
I've included the payload inside value.line_items.forEach().
*/
const orderedProduct = (value) => {
  value.line_items.forEach((item) => { 
    /* Since there can be multiple items for each order, I loop through each item to make sure 
      I call Klaviyo for each item. Each order must have at least one item so it's safe 
      to assume this payload will be mapped at least once for each order.
    */
    const payload = {
      token: process.env.PUBLIC_API_KEY,
      event: 'Ordered Product',
      customer_properties: {
        $email: value.email, 
        /*Email, first_name and last_name are always required when placing the order. 
        Worst case that can happen is one of the values being set to undefined.
        */
        $first_name: value.customer.first_name,
        $last_name: value.customer.last_name,
      },
      properties: {
        $event_id: item.id,
        $value: item.price,
        ProductID: item.product_id,
        SKU: item.sku,
        ProductName: item.name,
        Quantity: item.quantity,
        ProductURL: (item.url !== undefined) ? `${process.env.SHOP_NAME}.myshopify.com${item.url}` : '' , 
        // Shopify has the ability to return relative url for each item. If it does not exist, I simply pass an empty string
        ProductCategories: item.properties, // returns array
      },
      time: (new Date(value.processed_at).valueOf()) / 1000,
      /* Passing through the time at which the item has been processed by Shopify. I divide
        by 1000 since the value is in milliseconds
      */
    };
    pushDataToKlaviyo(payload) 
      .catch((error) => getLogger().error('error:', error));
  });
};

module.exports = orderedProduct;


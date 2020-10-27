const axios = require('axios');

const pushDataToKlaviyo = async (payload) => {
  const string = JSON.stringify(payload);
  const buffer = Buffer.from(string);
  const base64 = buffer.toString('base64');

  /*
  I am using axios to make the http call, while I use the Buffer class to convert 
  the JSON object into a base64 encoded string.
  */
  const result = await axios.get(`https://a.klaviyo.com/api/track?data=${base64}`);

  if (result.data === 0) {
    /*
      If the result.data comes back with 0, it means the data was not succesfully 
      uploaded to Klaviyo. In a case like this, I throw an error which I then catch
      inside of placedOrder or orderedProduct and I log the issue
    */
    throw new Error(`Failed to upload ${payload.properties.$event_id}`);
  }

  return true;
};

module.exports = pushDataToKlaviyo;


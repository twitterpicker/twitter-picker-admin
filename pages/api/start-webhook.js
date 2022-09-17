// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// ________________________SECRETS_&_letANTS_____________________________ //
let { Autohook } = require('twitter-autohook');
let crypto = require('crypto');
const axios = require('axios');



let webhook_environment = "bot";
let oauth_consumer_key = "hlQhvMOnBymAMIA6NMEZ5JHVx";
let oauth_consumer_secret = "V3ildX1OZQZFMoZYufoaWidI3SCoZ8Jt1Ne0cwtTT2F3tVDDKP";
let oauth_token = "1567795789820481544-FJLN9zWQ0lfJyRBsIH3T4MLQUg4wKG";
let oauth_token_secret = "zezBgyyKBztbNU9bTTFY1scaAnAUWyyR1dFgoLAhGXeRn";
let ngrok_secret = "2EtM5M5qIq8uJjl7UOLNjGwMfEU_F7hB1gXuB4hhLP1ypQVp";



let oauth_version = "1.0";
let oauth_signature_method = "HMAC-SHA1";
let method = 'POST';
let send_message_endpoint = "https://api.twitter.com/1.1/direct_messages/events/new.json";
let oauth_timestamp = null;
let oauth_nonce = null;







// ________________________UTILS__________________________________________ //

// returns a 32 Character Alpha-numeric string (to be used in authorization process)
function generateNonce(length) {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  console.log("Generated Nonce" + result);
  return result;
}
// returns a timestamp (to be used in authorization process)
function getTimeStamp() {
  return Math.floor(Date.now() / 1000);
}

// returns the necessary parameters (to be used in authorization process)
function getParameters() {
  oauth_timestamp = getTimeStamp();
  oauth_nonce = generateNonce(32);

  var parameters = {
    oauth_consumer_key: oauth_consumer_key,
    oauth_signature_method: oauth_signature_method,
    oauth_timestamp: oauth_timestamp,
    oauth_nonce: oauth_nonce,
    oauth_version: oauth_version,
    oauth_token: oauth_token,
    ngrok_secret: ngrok_secret,
  }
  console.log(parameters);
  return parameters;
}

// get auth signatures (uses parameters and follows twitter guideline)
function getEncodedOAuthSignature(parameters) {

  // step 1 : sort the parameter based on keys
  let ordered = {}
  Object.keys(parameters).sort().forEach(function (key) { ordered[key] = parameters[key]; });

  // encode the paramters in a string
  let encodedParameters = '';
  for (let k in ordered) {
    let encodedValue = escape(ordered[k]);
    let encodedKey = encodeURIComponent(k);
    if (encodedParameters === '') {
      encodedParameters += `${encodedKey}=${encodedValue}`;
    } else {
      encodedParameters += `&${encodedKey}=${encodedValue}`;
    }
  }
  // encode the baseurl
  let base_url = send_message_endpoint;
  let encodedUrl = encodeURIComponent(base_url);
  encodedParameters = encodeURIComponent(encodedParameters);
  // structure: METHOD&URL&PARAMETERS
  let signature_base_string = `${method}&${encodedUrl}&${encodedParameters}`
  let secret_key = oauth_consumer_secret;
  let secret_token = oauth_token_secret;

  // created a signing key
  let signing_key = `${encodeURIComponent(secret_key)}&${encodeURIComponent(secret_token)}`;

  // HMAC_SHA1 encoding
  let ouath_signature = crypto
    .createHmac('sha1', signing_key)
    .update(signature_base_string)
    .digest('base64');

  let encoded_oauth_signature = encodeURIComponent(ouath_signature);
  console.log("Signature : " + encoded_oauth_signature);
  return encoded_oauth_signature;
}
// returns auth header
function getHeader(parameters) {
  // signature (calculation)
  let encoded_oauth_signature = getEncodedOAuthSignature(parameters);
  let header = `OAuth oauth_consumer_key="${parameters.oauth_consumer_key}",oauth_token="${parameters.oauth_token}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${parameters.oauth_timestamp}",oauth_nonce="${parameters.oauth_nonce}",oauth_version="1.0",oauth_signature="${encoded_oauth_signature}"`;

  console.log("Header + " + header);
  return header;
}
// returns input (structured to send text to recipient ID)
function getInput(recipientID, text) {
  let input = JSON.stringify({
    event: {
      type: "message_create",
      message_create:
      {
        target: { recipient_id: recipientID },
        message_data: { text: text }
      }
    }
  });
  return input;

}
// ________________________________END OF UTILS _________________________________

// sends ${text} to recipeintID and
const sendMessage = async (recipientID, text) => {

  let header = getHeader(getParameters())
  let body = getInput(recipientID, text);
  const headers = {
    'Authorization': header,
    'Content-Type': 'application/json'
  };

  try {
    let result = await axios.post(send_message_endpoint, body, { headers });
    console.log(result.data);
  }
  catch (error) {
    console.log("error");
  }
  // return result;

  return {
    send_message_endpoint,
    header,
    body,
  }
}



// consumer that handles directing messages
async function consumeEvent(event) {
  console.log(event);

  if (event.direct_message_events) {
    let message = event.direct_message_events[0].message_create;
    // console.log(message);
    if (message) {
      let shouldBeSentTo = null;
      let messageWasSentTo = null;
      let messageWasSentBy = null;
      let messageContent = null;
      let URLSOfMessage = null;
      let firstURLOfMessage = null;

      shouldBeSentTo = event.for_user_id;
      messageWasSentTo = message.target.recipient_id;
      messageWasSentBy = message.sender_id;
      messageContent = message.message_data.text;
      URLSOfMessage = message.message_data.entities.urls;
      if (URLSOfMessage?.length !== 0) {
        console.log(JSON.stringify(URLSOfMessage));
        firstURLOfMessage = message.message_data.entities.urls[0].expanded_url;
      }
      let recievedMessage = (shouldBeSentTo === messageWasSentTo);
      if (recievedMessage) {
        console.log("Recieved A Message");
        let reply = `This is an automated reply. You sent "${messageContent}" to me!`;
        console.log(`sending a reply to : ${messageWasSentBy}`);
        await sendMessage(messageWasSentBy, reply);
      }
      else {
        console.log("Sent A Message");
      }
    }
  }
}


// exportable hook function, that starts a webhook subscription (for approx 2 hours)
let startHook = async () => {

  let isError = false;
  let webhook = new Autohook({
    consumer_key: oauth_consumer_key,
    consumer_secret: oauth_consumer_secret,
    token: oauth_token,
    token_secret: oauth_token_secret,
    env: webhook_environment,
  });

  try {
    await webhook.removeWebhooks();
  }
  catch (error) {
    console.log("Webhook still running");
    isError = true;
  }

  if (isError === false) {
    webhook.on('event', async (event) => await consumeEvent(event));
    await webhook.start();
    await webhook.subscribe({ oauth_token: oauth_token, oauth_token_secret: oauth_token_secret });
  }

}



export default async function handler(req, res) {
  try {
    await startHook()
  }
  catch (error) {
    console.log("Webhook still running");
  }
  res.status(200).json({ version: "1.0.0" })
}

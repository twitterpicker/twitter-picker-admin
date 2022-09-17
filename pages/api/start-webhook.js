// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// ________________________SECRETS_&_letANTS_____________________________ //
let crypto = require('crypto');
const axios = require('axios');
let { Autohook } = require('twitter-autohook');


let webhook_environment = "bot";
let oauth_consumer_key = "hlQhvMOnBymAMIA6NMEZ5JHVx";
let oauth_consumer_secret = "V3ildX1OZQZFMoZYufoaWidI3SCoZ8Jt1Ne0cwtTT2F3tVDDKP";
let oauth_token = "1567795789820481544-FJLN9zWQ0lfJyRBsIH3T4MLQUg4wKG";
let oauth_token_secret = "zezBgyyKBztbNU9bTTFY1scaAnAUWyyR1dFgoLAhGXeRn";
let URL = "https://twitter-picker-admin.netlify.app/api/send-message";


// consumer that handles directing messages
async function consumeEvent(event) {
  if (event.direct_message_events) {
    let message = event.direct_message_events[0].message_create;
    // console.log(message);
    if (message) {
      let shouldBeSentTo = messageWasSentTo = messageWasSentBy = messageContent = URLSOfMessage = firstURLOfMessage = null;
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
let startHook = async (URL) => {
  let webhook = new Autohook({
    consumer_key: oauth_consumer_key,
    consumer_secret: oauth_consumer_secret,
    token: oauth_token,
    token_secret: oauth_token_secret,
    env: webhook_environment,
  });
  await webhook.removeWebhooks();
  webhook.on('event', async (event) => await consumeEvent(event));
  if (URL) {
    await webhook.start(URL);
  }
  else {
    await webhook.start();
  }
  await webhook.subscribe({ oauth_token: oauth_token, oauth_token_secret: oauth_token_secret });
}



export default async function handler(req, res) {
  await startHook(URL);
  res.status(200).json({ version: "1.0.0" })
}

"use strict";

const axios = require("axios");
const apiAiClient = require("apiai")("2d256dc703224a8c9553ba5da8d16562");
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json()); // creates express http server

var send_receive;

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

app.post("/webhook", (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    body.entry.forEach(function(entry) {
      let event = entry.messaging[0];
      let userID = event.sender.id;
      let message = event.message;
      console.log(event);
      let page_token =
        "EAALFOmWJPdgBAOU50h3qzyA4ngzeVLd2dw6d7vhs0goHSUXeKK2ryADFvpdvi0TXJqHkN5ruIkpjVaWEZAfZCGjIyGyPB3Kx9o7PFqB9GVFbwufHAbbjotmydcCeNKVFaFuoXyXVKuH1ZChpnO7WRpKleycRMqse6ivMiD58gZDZD";
      if (message && message !== send_receive) {
        if (message.text.toLowerCase().indexOf("chien") != -1) {
          send_model("dog", page_token, userID);
          res.status(200).send("EVENT_RECEIVED");
        } else if (message.text.toLowerCase().indexOf("chat") != -1) {
          send_model("cat", page_token, userID);
          res.status(200).send("EVENT_RECEIVED");
        } else if (
          message.text.toLowerCase().indexOf("adopter") != -1 ||
          message.text.toLowerCase().indexOf("animal") != -1
        ) {
          send_quick_replies(page_token, userID);
          res.status(200).send("EVENT_RECEIVED");
        } else {
          const apiaiSession = apiAiClient.textRequest(message.text, {
            sessionId: "Tom_bot_agent"
          });
          apiaiSession.on("response", response => {
            const result = response.result.fulfillment.speech;
            send_message(userID, page_token, result);
          });
          apiaiSession.on("error", error => console.log(error));
          apiaiSession.end();
          res.status(200).send("EVENT_RECEIVED");
        }
      } else {
        if (
          event.postback &&
          event.postback.payload === "USER_DEFINED_PAYLOAD"
        ) {
          axios
            .get(
              "https://graph.facebook.com/" +
                userID +
                "?fields=first_name,last_name,profile_pic&access_token=" +
                page_token
            )
            .then(response => {
              let firstname = response.data.first_name;
              let lastname = response.data.last_name;
              send_message(
                userID,
                page_token,
                "Bonjour " + firstname + " " + lastname + " !"
              );
              res.status(200).send("EVENT_RECEIVED");
            });
        } else {
          if (event.postback.payload == "NO_DOG") {
            send_message(
              userID,
              page_token,
              "Vous ne souhaitez pas adopter de chien !"
            );
          } else if (event.postback.payload == "DOG_SELECTED") {
            send_message(
              userID,
              page_token,
              "Vous souhaitez adopter un chien !"
            );
          } else if (event.postback.payload == "CAT_SELECTED") {
            send_message(
              userID,
              page_token,
              "Vous souhaitez adopter un chat !"
            );
          } else {
            send_message(
              userID,
              page_token,
              "Vous ne souhaitez pas adopter de chat !"
            );
          }

          res.status(200).send("EVENT_RECEIVED");
        }
      }
    });
  }
});

function send_model(animal, page_token, userID) {
  let payload_txt = "CAT_SELECTED";
  let payload_refuse = "NO_CAT";
  let img_url =
    "https://www.wanimo.com/veterinaire/images/articles/chat/fibrosarcome-chat.jpg";
  if (animal == "dog") {
    payload_txt = "DOG_SELECTED";
    payload_refuse = "NO_DOG";
    img_url =
      "https://www.royalcanin.fr/wp-content/uploads/Golden-Retriever-Images-Photos-Animal-000120-500x500.png";
  }
  axios.post(
    "https://graph.facebook.com/v2.6/me/messages?access_token=" + page_token,
    {
      recipient: {
        id: userID
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Faites votre choix",
                image_url: img_url,
                subtitle: "Adopter cet animal ?",
                buttons: [
                  {
                    type: "postback",
                    title: "Oui",
                    payload: payload_txt
                  },
                  {
                    type: "postback",
                    title: "Non",
                    payload: payload_refuse
                  }
                ]
              }
            ]
          }
        }
      }
    }
  );
}

function send_quick_replies(page_token, userID) {
  axios
    .post(
      "https://graph.facebook.com/v2.6/me/messages?access_token=" + page_token,
      {
        recipient: {
          id: userID
        },
        message: {
          text: "Selectionne un animal !",
          quick_replies: [
            {
              content_type: "text",
              title: "Chien",
              payload: "DOG_SELECTED"
            },
            {
              content_type: "text",
              title: "Chat",
              payload: "CAT_SELECTED"
            }
          ]
        }
      }
    )
    .catch(err => console.log("ERREUR --> ", err));
}

function send_message(userID, page_token, message) {
  axios.post(
    "https://graph.facebook.com/v3.0/me/messages?access_token=" + page_token,
    {
      recipient: {
        id: userID
      },
      sender_action: "typing_on"
    }
  );
  setTimeout(() => {
    axios.post(
      "https://graph.facebook.com/v2.6/me/messages?access_token=" + page_token,
      {
        messaging_type: "RESPONSE",
        recipient: {
          id: userID
        },
        message: {
          text: message
        }
      }
    );
  }, 50 * message.length);
  send_receive = message;
}

// Accepts GET requests at the /webhook endpoint
// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "verifytoken";

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

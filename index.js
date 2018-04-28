var https = require('https');

exports.handler = (event, context, callback) => {
  try {
    if (event.session.new) {
      console.log("NEW SESSION");
    }
    switch (event.request.type) {
      case "LaunchRequest":
        console.log("LAUNCH REQUEST");
        onLaunchRequest(event, context);
        break;
      case "IntentRequest":
        console.log("INTENT REQUEST");
        break;
      case "SessionEndedRequest":
        console.log("SESSION END REQUEST");
        break;
      default:
        context.fail("INVALID REQUEST TYPE:" + event.request.type);
    }

  } catch (error) {
    context.fail("Exception: " + error);
  }
};

function onLaunchRequest(event, context) {
  console.log("In function onLaunchRequest");
  context.succeed(
    generateResponse(buildSpeechletResponse(
      "Welcome to Market Tracker. Ask me what the stock market is like today.", false))
    );
}

function onIntentRequest(event, context) {
  console.log("In function onIntentRequest");

  const intent = event.request.intent;

  if(intent.name === 'GetIndex') {
    console.log("Calling the GET INDEX intent");
    getIndex(intent, context);
  } else {
    context.fail("Could not identify indent: " + intent.name);
  }
}

function getIndex(intent, context) {
  var endpoint = "https://www.alphavantage.co/query?" +
  "function=TIME_SERIES_DAILY&symbol=DJI&outputsize=1&apikey=S3L99HG47ZDQQWI5";

  var body = "";

  https.get(endpoint, (response) => {
      response.on('data', (chunk) => {
        console.log("Received data response");
        body += chunk
      });

      response.on('end', () => {
        var jsonData = JSON.parse(body);
        var timeSeriesData = jsonData["Time Series (Daily)"];

        var currentValue = "";
        for (key in timeSeriesData) {
          var dayData = timeSeriesData[key];
          currentValue = dayData["4. close"];
          break;
        }

        console.log("Current stock value is: " + currentValue);
        speechOutput = `DJIA is ${currentValue}. Thank you for using Market Tracker. Good bye.`;
        context.succeed(generateResponse(buildSpeechletResponse(speechOutput, false), {}));
      });
  });
}

buildSpeechletResponse = (outputText, shouldEndSession) => {
  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    card: {
      type: "Simple",
      title: "Stock Tracker",
      content: outputText
    },
    shouldEndSession: shouldEndSession
  };
};

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };
};

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

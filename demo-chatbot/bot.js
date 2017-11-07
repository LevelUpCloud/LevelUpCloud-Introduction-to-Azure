/*-----------------------------------------------------------------------------
Simple Chat Bot - (c) Level Up Cloud 2017
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

/*-----------------------------------------------------------------------------
Use emulator if this is 'development' otherwise use BotService
-----------------------------------------------------------------------------*/

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

/*-----------------------------------------------------------------------------
Obtain auth app ID, Key etc
-----------------------------------------------------------------------------*/

var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })



/*-----------------------------------------------------------------------------
This is where we match intents ...
LUIS is used to convert what is typed to the bot (utterances)
to what is MEANT (intents)
The first one is a 'catch all' so the bot can respond if it doesnt understand
-----------------------------------------------------------------------------*/


.matches('None', (session, args) => {
	session.send('sorry I dont understand what you mean')
	session.send(JSON.stringify(args))
})

/*-----------------------------------------------------------------------------
Otherwise we can match intents we expect
any greeting
questions about the weather
-----------------------------------------------------------------------------*/

.matches('greeting', (session, args) => {
	session.send('Hi to you too!!!!, having a good day ?')
	session.send(JSON.stringify(args)) // this is used to show you what LUIS things - shows % chance of all intents
})
.matches('weather', (session, args) => {
	session.send('its probably snowing!')
	session.send(JSON.stringify(args)) // this is used to show you what LUIS things - shows % chance of all intents
})
.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

bot.dialog('/', intents);    

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
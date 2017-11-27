
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


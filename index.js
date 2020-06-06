const Discord = require('discord.js');
const parse = require('dotenv/config');

if(parse.error) {
    throw parse.error;
}

const client = new Discord.Client();

let users = {};

client.on('ready', () => {
    console.log('Ready and running!');
});
client.on('error', (e) => console.log(e));

const token = process.env.CLIENT_TOKEN;

console.log(`logging in whith token ${token}`, );

client.login(token)
    .then(onLogin)
    .catch(onError);

function onError(err) {
    console.error(err)
}

function onLogin() {
    console.log('Login succesfull');
} 

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

client.on('message' , message => {
    const now = new Date();
    console.log(`[MESSAGE](${now.toISOString}):`);
    if(message.content.includes('\\re')) {
        const [command, args] = message.content.trim().split(' ');
        
        const user = getUserFromMention(args);

        if(!user) message.channel.send('Usuário não encontrado');

        let cited = users[user.id];

        if(!cited) users[user.id] = 1;
        else users[user.id] += 1;

        message.channel.send(`<@${user.id}> ja reclamou ${users[user.id]} vezes.`);

        const n = Math.abs(~(Math.random() * 100));

        if(Math.abs(n%3 === 0)) {
            message.channel.send(`Ei <@${user.id}> larga de ser chato`)
        }
    }
})
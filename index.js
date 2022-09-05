const {Client, GatewayIntentBits} = require('discord.js')
require('dotenv/config')
const itemSchema = require('./schemas/item-schema')
const mongo = require('./mongo')


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})


const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
      try {
        console.log('Connected to mongodb!')

        const result = await itemSchema.find({
            name: 'Acorn',
        })
        console.log('Result: ', result[0].name + ' ' + result[0].id)
        //console.log('Result: ', result)
      } 
      catch(err) {
        console.error(err.message);
      }
      finally {
        mongoose.connection.close()
      }
    })
  }
  
  connectToMongoDB()


  client.on('ready', () => {
    console.log('Bot is ready')
})


client.on('messageCreate', message => {
    if (message.content === 'ping'){
        message.reply('pong')
    }
})

client.login(process.env.TOKEN)
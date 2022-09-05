const mongo = require('.././mongo')
const axios = require('axios')
const itemSchema = require('.././schemas/item-schema')
const { EmbedBuilder } = require('discord.js');
const { MessageEmbed } = require("discord.js");
module.exports = {
    
    callback: (message, ...args)=>{
        
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }

          function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            return time;
          }

        let str = args.toString().toLocaleLowerCase().replace(/,/g, ' ');
        let itemName = capitalizeFirstLetter(str);
        var itemID

        const connectToMongoDB = async () => {
            await mongo().then(async (mongoose) => {
              try {
                console.log('Connected to mongodb!')
                console.log(`Item Name: ${itemName}`)
                const result = await itemSchema.find({
                  //  name: `${itemName}`,
                  name: {$regex : itemName.toString(), "$options": "i" }
                //    name : {$regex : `${itemName}`},
                })
                console.log('Result: ', result[0].name + ' ' + result[0].id)
                itemID = result[0].id
                itemName = result[0].name
                itemDesc = result[0].examine
                itemLimit = result[0].limit
                console.log(`Item ID: ${itemID}`)

                var getItemID = function(){return itemID;}
                var newItemID = getItemID();

                var getItemName = function(){return itemName;}
                var newItemName = getItemName();

                var getItemDesc = function(){return itemDesc;}
                var newItemDesc = getItemDesc();

                var getItemLimit = function(){return itemLimit;}
                var newItemLimit = getItemLimit();

                let item_pic = newItemName.replace(/ /g,"_");

                // let uri = `https://prices.runescape.wiki/api/v1/osrs/latest?id=`

                // if(newItemID.length){
                //     uri += `${newItemID}`
                // }

                // const { data } = await axios.get(uri)
                // console.log(data)
                // message.reply(`Item Name: ${newItemName} + Item High: ${data.data[high]}`)


                axios({
                    method: "get",
                    url: `https://prices.runescape.wiki/api/v1/osrs/latest?id=${newItemID}`,
                }).then(function(response) {
                    console.log(response.data)                   
                    let low = response.data.data[newItemID].low
                    let high = response.data.data[newItemID].high
                   // message.reply(`Item Name: ${newItemName} Item Low: ${low}`)
                   

                   
                  low_time = (timeConverter(response.data.data[newItemID].lowTime));
                  high_time = (timeConverter(response.data.data[newItemID].highTime));


                  let low_format = numberWithCommas(low);
                  let high_format = numberWithCommas(high);

                   const exampleEmbed = new EmbedBuilder()
                   .setColor(0x0099FF)
                   .setTitle(`${newItemName}`)
                   .setURL(`https://oldschool.runescape.wiki/w/${item_pic}`)
                   .setAuthor({ name: 'Runey Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                   .setDescription(`${newItemDesc}`)
                   .setThumbnail(`https://oldschool.runescape.wiki/images/thumb/${item_pic}_detail.png/92px-${item_pic}_detail.png?47211`)
                   .addFields(
                  //  { name: `Item Name: `, value: `${newItemName}`, inline: true },
                    
                    { name: 'Buy Limit', value: `${newItemLimit}`},
                  //  { name: '\u200B', value: '\u200B' },
                    { name: 'Low Price: ', value: `${low_format}`, inline: true },
                { name: '\u200B', value: `\u200B`, inline: true },
                { name: 'Timestamp', value: `${low_time}`, inline: true },
                    { name: 'High Price: ', value: `${high_format}`, inline: true },
                { name: '\u200B', value: `\u200B`, inline: true },
                { name: 'Timestamp', value: `${high_time}`, inline: true },
                   )
                  // .addFields({ name: 'Buy Limit', value: `${newItemLimit}`, inline: true })
               //    .setImage('https://i.imgur.com/AfFp7pu.png')
                   .setTimestamp()
                   .setFooter({ text: 'Response Generated', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
               
              // channel.send({ embeds: [exampleEmbed] });



                   message.reply({embeds: [exampleEmbed]});
                    
                })

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

         
    },
}

